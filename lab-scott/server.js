'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ',1)}\n`);
});

ee.on('@all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('@nick', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName} is now: ${string}`));

  client.nickName = string.split(' ').slice(0).join(' ').trim();
});

ee.on('@dm', (client, clientB, string) => {

  pool.forEach(c => {

    if(c.nickName === clientB) {
      c.socket.write(`${client.nickName} wispered to you: ${string}`);
    }
  });
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected.\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command === '@all'){
      ee.emit('@all', client, data.toString().split(' ').slice(1).join(' '));
      return;
    } else if (command === '@nick'){
      ee.emit('@nick', client, data.toString().split(' ').slice(1).join(' '));
      return;
    } else if (command === '@dm'){
      let clientB = data.toString().split(' ')[1];

      ee.emit('@dm', client, clientB, data.toString().split(' ').slice(2).join(' ').trim());
      return;
    }
    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
