'use strict';

const Client = require('./lib/client');
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
  pool.forEach(ele => ele.socket.write(`${client.nickname}: ${string}`));
});

ee.on('/nick', function(client, string) {
  client.id = client.nickname;
  client.nickname = string.trim().split(' ').join('');
  client.socket.write(`Set nickname to ${client.nickname}\n`);
  pool.forEach(ele => ele.socket.write(`${client.id} set nickname as ${client.nickname}\n`));
});

ee.on('/dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  pool.forEach(dm => {
    if (dm.nickname === nickname) {
      dm.socket.write(`DM from ${client.nickname}: ${message}\n`);
    }
  });
  client.socket.write(`DM to ${nickname}: ${message}\n`);
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(ele => ele.socket.write(`${client.username} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('/')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });
  socket.on('error', err => {
    console.log(`ERROR: ${err}`);
  });
  socket.on('close', data => {
    ee.emit('quit', client, data.toString());
    pool.forEach(ele => ele.socket.write(`${client.nickname} has logged off.`));
  });
});


server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
