'use strict';

const Client = require('./lib/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];
ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command:${string.split(' ', 1)}`);
});

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.nickName = `${string}`;
});

ee.on('error', (client, e) => {
  client.socket.write(`ERROR:${e.code.split(' ', 1)}`);
  server.close();
});

ee.on('close', client => {
  pool.pop(client);
  pool.forEach(c => c.socket.write(`${client.userName} has disconnected\n`));
});

// ee.on('/dm', (client, string) => {
//
// });


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
      client.nickName = data.toString().split(' ').slice(1).join(' ');
      pool.forEach(c => c.socket.write(`${client.userName} has changed their name to ${client.nickName}\n`));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
