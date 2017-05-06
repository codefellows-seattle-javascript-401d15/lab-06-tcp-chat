'use strict';

const Client = require('./lib/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module .exports = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];
ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command:${string.split(' ', 1)}`);
});

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.nickName = string.trim();
});

ee.on('/dm', (client, string) => {
  let target = string.split(' ')[0];
  let message = string.split(' ').slice(1).join(' ');
  pool.forEach(c => {
    if(c.nickName === target) {
      c.socket.write(`${c.nickName}: ${message}`);
    }
  });
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('/all')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    if(command.startsWith('/nick')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      pool.forEach(c => c.socket.write(`${client.userName} has changed their name to ${client.nickName}\n`));
      return;
    }

    if(command.startsWith('/dm')){
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' ').trim());
      return;
    }
    ee.emit('default', client, data.toString());
  });

  socket.on('close', function () {
    pool.forEach(c => c.socket.write(`${client.userName} has peaced out!\n`));
    removeSocket(socket);
  });

  socket.on('error', err => {
    console.log(err);
  });
});

function removeSocket (socket) {
  pool.splice(pool.indexOf(socket), 1);
}

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
