'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('@ALL', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('@NICK', (client, string) => {
  let oldName = client.nickName;
  let userEntry = string.split(' ').shift();
  client.nickName = userEntry;
  pool.forEach(c => c.socket.write(`User: ${oldName}\nChanged name to: ${client.nickName}`));
});

ee.on('@DM', (client, string) => {
  let fromUser = client.nickName;
  let msg = string.split(' ').slice(1).join(' ').trim();
  let holdString = string.split(' ');
  // console.log('holdString', holdString);
  let userEntry = holdString.shift();
  function findClient(client) {
    console.log(`userEntry: '${userEntry}'\nstring is: '${string}' \n`);
    // console.log('client is: ', client);
    return client.nickName === userEntry;
  }

  // string = holdString.shift().toString();
  holdString = holdString.join(' ');
  // console.log('holdstring is now: ', holdString);
  let clientObj = pool.find(findClient);
  console.log('userEntry is:', userEntry, '\nmsg is:', msg, clientObj);
  clientObj.socket.write(`Direct message from: ${fromUser} Message: ${msg}`);

  // console.log(`this should be the client object for the user selected: ${clientObj.nickName}\n socket is:`, clientObj.socket);${holdString}
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    // console.log('command is: ', command);
    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      console.log('this is command ', command);
      return;
    }

    ee.emit('default', client, data.toString());
  });
});


server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
