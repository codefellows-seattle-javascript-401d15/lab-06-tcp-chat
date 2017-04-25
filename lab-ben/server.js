'use strict';

const Client = require('./model/client.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// default error command
ee.on('default', (client, string) => {
  client.socket.write(` Not a valid command: ${string.split(' , ', 1)}\n`);
});

// send a message to all users
ee.on('\\all', (client, string) => {
  pool.forEach(c => {
    c.socket.write(`${client.nickName}: ${string}`);
  });
});

//change nickname
ee.on('\\nick', (client, newName) => {
  client.nickName = newName.trim();
  client.socket.write(`You have changed your nickname to ${client.nickName}\n`);
});


//private message
ee.on('\\dm', (client, string) => {
  let target = pool.find(t => {
    return t.nickName === string.split(' ').shift().trim();
  });
  let message = string.split(' ').slice(1).join(' ');
  if (target) {
    client.socket.write(`To ${target.nickName}: ${message}`);
    target.socket.write(`From ${client.nickName}: ${message}`);
    return;
  }
  else {
    client.socket.write(`${string.split(' ').shift().trim()} is not a valid nickName`);
    return;
  }
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has joined the channel\n`));

  //runs commands
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    if (command.startsWith('\\')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    //removes the closing user from the pool
    socket.on('close', function() {
      let selfIndex = pool.findIndex(c => c);
      pool.splice(selfIndex, selfIndex);
      return;
    });

    // logs errors on the console
    socket.on('error', function(err) {
      console.error(err);
      return;
    });

    ee.emit('default', client, data.toString());
  });
});
