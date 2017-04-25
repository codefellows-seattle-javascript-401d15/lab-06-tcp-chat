'use strict';

const Client = require('./model/client.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

server.listen(PORT, function() {
  console.log(`Listening on: ${PORT}`);
});

const pool = [];

ee.on('default', function(client, string) {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('/all', function(client, string) {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}\n`));
});

ee.on('/nick', function(client, string) {
  client.nickName = string.trim().split(' ').join('').toUpperCase();
  client.socket.write(`You changed your nickname to ${client.nickName}\n`);
  console.log(`${client.userName} changed their nickname to ${client.nickName}`);
});

ee.on('/dm', function(client, string) {
  let nickName = string.split(' ').shift().trim().toUpperCase();
  let message = string.split(' ').slice(1).join(' ').trim();

  pool.forEach(dm => {
    if (dm.nickName === nickName) {
      dm.socket.write(`Private Message from ${client.nickName}: ${message}\n`);
    }
  });
  client.socket.write(`You private messaged ${nickName}: ${message}\n`);
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    console.log(`${client.nickName}: ${data}`);
    if(command.startsWith('/')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });


  socket.on('error', error => {
    console.log(`Error: ${error}`);
  });

  socket.on('close', data => {
    ee.emit('quit', client, data.toString());
    console.log(`${client.nickName} has left the conversation`);

  });
});
