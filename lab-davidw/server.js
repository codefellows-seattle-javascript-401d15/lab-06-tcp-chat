'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();

const server = net.createServer();

const PORT = process.env.PORT || 3000;

const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('/')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });

  //When a socket emits the error event log on server
  socket.on('error', (err) => {
    console.error(err);
  });

  //When a socket emits the close event
  socket.on('close', () => {
    for (let i = 0; i < pool.length; i++) {
      if(pool[i] === client) {
        pool.splice(i, 1);
      }
    }
    for (let i = 0; i < pool.length; i++) {
      pool[i].socket.write(`${client.nickName} has left\n`);
    }
  });
});

ee.on('/nick', (client, string) => {
  for (var i = 0; i < pool.length; i++) {
    if(string.trim() === pool[i].nickName) {
      client.socket.write(`${string} already used. Please pick another nickname.\n`);
      return;
    }
    pool[i].socket.write(`${client.nickName} has changed their nickname to ${string}.\n`);
  }
  client.nickName = string.trim();
});

//sends direct message to another user if they exist
ee.on('/dm', (client, string) => {
  for (var i = 0; i < pool.length; i++) {
    if (string.split(' ')[0] === pool[i].nickName) {
      client.socket.write(`${client.nickName}(Direct Message to ${pool[i].nickName}): ` + string.split( ' ').slice(1).join(' '));
      pool[i].socket.write(`(Direct Message from ${client.nickName}): ` + string.split(' ').slice(1).join(' '));
      return;
    }
  }
  client.socket.write(`Sorry, ${client.nickName}, that user cannot receive a direct message at this time.`);
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
