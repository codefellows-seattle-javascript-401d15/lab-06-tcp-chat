'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 4000;

const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('@all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  socket.on('close',() => {
    pool.forEach((c, index) => {
      console.log('This is in socket.close');
      let tempUser = client.userName;
      if (c.userName === tempUser){
        pool.splice(index, 1);
      }
      console.log(`${tempUser} has left the chat.`);
    });
    console.log(`This is the current ${pool} of clients`);
  });

  socket.on('error', () => {
    console.log('There is an error.');
  });

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    if(command.startsWith('\\all')){
      ee.emit(command, client, data)
    }

    if(command.startsWith('\\nick')){
      ee.emit(command, client, data)
    }

    if(command.startsWith('\\dm')){
      ee.emit(command, client, data)
    }

    if(command.startsWith(`${nickName}`)){
      ee.emit(command, client, data)
    }

    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
