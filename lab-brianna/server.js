'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module.export = net.createServer();
const PORT = process.env.PORT || 4000;

const pool = [];

//default error command message
ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

//sends a message to all users
ee.on('\\all', (client, string) => {
  console.log('this is the \\all command');
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

//allows user to change nickname
ee.on('\\nick', (client, newNickName) => {
  client.nickName = newNickName.trim();
  client.socket.write(`You have changed your nickname to ${client.nickName}\n`);
});

//allows user to direct message another user by nickname
ee.on('\\dm', (client, string) => {
  let toUser = pool.find(u => {
    return u.nickName === string.split(' ').shift().trim();
  });
  let message = string.split(' ').slice(1).join(' ');
  if (toUser) {
    client.socket.write(`To ${toUser.nickName}: ${message}`);
    toUser.socket.write(`From ${client.nickName}: ${message}`);
    return;
  }
});


server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  socket.on('close',() => {
    pool.forEach((c, index) => {
      console.log('This is in socket.close');
      let tempUser = client.userName;
      if (c.userName === tempUser){
        pool.splice(index, 1);
      }
      console.log(`${tempUser} has left the chat.`);
    });
    console.log(`This is the current ${pool} of clients`);
  });

  socket.on('error', () => {
    console.log('There is an error.');
  });

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('\\')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
