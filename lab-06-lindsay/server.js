'use strict';

const Client = require('./models/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

ee.on('default', (client, string)  => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.nickName = string.trim();
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickrName} has connected!\n`));

  socket.on('data', data => {

    let command = data.toString().split(' ').shift().trim();

    if(command.startsWith('/')){
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
    return;
  });

    socket.on('close', function() {
      console.log(`${client.nickName} left the room.`);
      removeSocket(socket);
    });

    socket.on('error', function() {
      console.log(`Error: ${error.message}`);
    });
});

function removeSocket(socket) {
  pool.splice(pool.indexOf(socket), 1);
}

server.listen(PORT, () => console.log(`Listning on: ${PORT}`));
