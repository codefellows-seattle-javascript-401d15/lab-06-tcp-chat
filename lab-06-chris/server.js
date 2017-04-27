'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module.exports = net.createServer();
const PORT = process.env.PORT || 3000;
const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('@ALL', (client, string) => {
  pool.forEach(c => c.socket.write(`Mass message from ${client.nickName}:\n${string}\n`));
});

ee.on('@NICK', (client, string) => {
  let oldName = client.nickName;
  let userEntry = string.split(' ').shift().trim();

  client.nickName = userEntry;
  pool.forEach(c => c.socket.write(`User: ${oldName}\nChanged name to: ${client.nickName}\n`));
});

ee.on('@DM', (client, string) => {
  let fromUser = client.nickName;
  let msg = string.split(' ').slice(1).join(' ').trim();
  let holdString = string.split(' ');
  let userEntry = holdString.shift().trim();

  function findClient(client) {
    return client.nickName === userEntry;
  }

  let clientObj = pool.find(findClient);
  clientObj.socket.write(`Direct message from: ${fromUser}\nMessage: ${msg}\n`);
});

server.on('connection', socket => {
  let client = new Client(socket);

  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});


server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
