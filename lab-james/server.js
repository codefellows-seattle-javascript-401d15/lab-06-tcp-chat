'use strict';

const Client = require('./models/client.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module.exports = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid string: ${string.split(' '), [0]}\n`);
});

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.nickName = string.trim();
  client.socket.write(`Your nickname is now: ${client.nickName}`);
});

ee.on('/dm', (client, string) => {
  let endUser = string.split(' ', 1);
  let message = string.split(' ').slice(1);

  pool.forEach(c => {
    if (c.nickName === endUser) {
      c.socket.write(`${client.nickName}: ${message}\n`);
    }
  });
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has joined!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('/')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });

  socket.on('close', client => {
    pool.splice(pool.indexOf(client), 1);
  });

  socket.on('error', error => {
    console.log(error);
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
