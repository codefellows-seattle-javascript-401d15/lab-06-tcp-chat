'use strict';

const Client = require('./model/pages.js');
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
  pool.forEach(c => c.socket.write(`${client.nickname}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.nickname = string.trim();
});

ee.on('/dm', (client, string) => {
  let target = string.split(' ')[0];
  let message = string.split(' ').slice(1).join('');
  pool.forEach(c => {
    if(c.nickname === target) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

ee.on('/close', (client) =>{
  pool.splice(pool.indexOf(client), 1);
  pool.forEach(c => c.socket.write(`${client.nickname}: Left Room \n`));
  console.log('New Pool', pool);
});


server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  console.log('Current Pool', pool);
  pool.forEach(c => c.socket.write(`${client.userName} has connected! Nickname: ${client.nickname}\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('/all')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    else if(command.startsWith('/nick')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    else if(command.startsWith('/dm')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    else if(command.startsWith('/close')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });

  socket.on('error', err => {
    console.log(err);
  });
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
