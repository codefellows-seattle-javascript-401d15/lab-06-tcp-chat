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

ee.on('@all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.id = client.nickname;
  client.nickname = string.trim().split(' ').join('');
  client.socket.write(`New nickname ${client.nickname}`);
  pool.forEach(ele => ele.socket.write(`${client.id} is now ${client.nickname}`))
});

ee.on('/dm', (client, string) => {
  let recipient = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();
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
  socket.on('close', data => {
    ee.emit('leave', client, data.toString());
    pool.forEach(c => c.socket.write(`${client.userName} has left the building.`));
    unPlug(socket);
  });
  server.on('error', err => {
    pool.forEach(c => c.socket.write('Error ' + err.message));
  });
});


server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
