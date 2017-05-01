'use strict';

const Client = require('./model/client.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module.exports = net.createServer();
const PORT = process.env.PORT || 3000;
const pool = [];


ee.on('default', (client, string) => {
  client.socket.write(`GOD: Not a valid command: ${string.split(' ', 1)}\n`);
});
ee.on('@all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});
ee.on('@nick', (client, string) => {
  pool.forEach(c => c.socket.write(`GOD: ${client.nickName} has changed to ${string}`));
  client.nickName = string.trim();
});
ee.on('@dm', (client, string) => {
  let found = false;
  for(let i=0; i < pool.length; i++){
    if(pool[i].nickName === string.split(' ').shift().trim()){
      let message = `${client.nickName} @ ${pool[i].nickName}: ${string.split(' ').slice(1).join(' ')}`;
      pool[i].socket.write(message);
      client.socket.write(message);
      found = true;
    }
  }
  if(found === false){
    client.socket.write(`GOD: ${string.split(' ').shift().trim()} is in a better place`);
  }
});
ee.on('@channel', (client, string) => {
  pool.forEach(c => {
    client.socket.write(c.nickName);
  });
});


server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`GOD: ${client.nickName} has connected\n`));
  client.socket.write('COMMANDS: @all MESSAGE; @nick USERNAME; @dm USERNAME MESSAGE; @channel (list online users); @linux users: leave telnet connection by [ ctrl ] + [ ] ]');

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });

  socket.on('error', err => {
    console.error(err.message);
  });

  socket.on('close', () => {
    pool.forEach(c => {
      c.socket.write(`${client.nickName} has left\n`);
      c.socket.write('GOD: bye bitch');
    });
    for(let i = 0; i < pool.length; i++){
      if(pool[i] === client) pool.splice(i, 1);
    }
  });
});


server.listen(PORT, () => console.log(`listening on: ${PORT}`));
