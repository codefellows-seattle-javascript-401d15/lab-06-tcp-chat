'use strict';

const Client = require('./model/chat');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = []; //where the clients are added. //look @ docs, node net module create server

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command:${string.split(' ', 1)}\n`);
});

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.nickName = string.trim();
});

ee.on('/dm', (client, string) => {
  let recipient = string.split(' ')[0];
  let message = string.split.slice(1).join(' ');
  pool.forEach(c => {
    if(c.nickName === recipient){
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
    if(command.startsWith('/')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });
  function unPlug(socket){
    pool.splice(pool.indexOf(socket), 1);
  }
  socket.on('close', function(){
    pool.forEach(c => c.socket.write(`${client.userName} has left the building.`));
    unPlug(socket);
  });
  server.on('error', err => {
    pool.forEach(c => c.socket.write('Error ' + err.message));
  });
});




server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
