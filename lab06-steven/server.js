'use strict';

const Client = require('./model/client.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Command Not Valid: ${string.split(' ', 1)}\n`);
});

ee.on('/all', (client, string) => {
  pool.forEach(u => u.socket.write(`${client.nickName}: ${string}`));
});


server.on('connection', (socket) => {
  let client = new Client;
  pool.push(client);
  pool.forEach(u => u.socket.write(`${client.nickName} has connected!`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if (command.startsWith('/')) {
      ee.emit(command, client, data.split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
