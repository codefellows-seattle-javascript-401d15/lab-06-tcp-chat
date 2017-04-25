'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 8080;

const pool = [];

ee.on('default', (client, string) => {client.socket.write(`Not a valid command:${string.split(' ', 1)}`);
});

ee.on('@all', (client, string) => {
  console.log('this is the string', string);
  pool.forEach(c => c.socket.write(`${client.userName}: ${string}`));
});

ee.on('/nic', (client, string) => {
  pool.forEach(c => {
    if(string.trim() === c.nickName){
      client.socket.write(`${string} already been used, please choose a new nickname.`);
    }
    c.socket.write(`${client.nickName} has changed their nickname to ${string}.`);
  });
  client.nickName = string.trim();
});
ee.on('@dm', (client, string) => {
  pool.forEach(c => {
    if(string.split(' ')[0] === c.nickName){
      client.socket.write(`${client.nickName} Directmessage too ${c.nickName}: ${string.split('').slice(1).join()}`);
      c.socket.write(`Direct Message from:${client.nickname}: ${string.splice(' ').slice().join(' ')}`);
    }
  });
});
server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has connected!`));


  socket.on('data', data => {
    let command = data.toString().split('').shift().trim();
    if(command.startsWith('@')){
      console.log(data.toString(), 'we are inside if block');
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }else {ee.emit('default', client, data.toString());
    }
  });
  socket.on('error', err => {
    console.error(err);
  });
  socket.on('close', () => {
    pool.forEach(c => {
      if(c === client){
        pool.splice(c, 1);
      }
    });
  });
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
