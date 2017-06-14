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

ee.on('@all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('@nick', (client, string) => {
  //grab current nickName and assigning to variable of old name before changing
  let oldNickName = client.nickName;
  client.nickName = string;
  pool.forEach(c => c.socket.write(`${oldNickName} changed nickname to: ${client.nickName}\n`));
});

ee.on('@dm', (client, string) => {
  let dmNickName = string.split(' ').shift().trim();
  let dmMessage = string.split(' ').slice(1).join(' ');
  pool.forEach(function(c) {
    if(dmNickName === c.nickName) {
      c.socket.write(`${client.nickName}: ${dmMessage}`);
    }
  });
});

server.on('connection', function(socket) {

  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@all')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    if(command.startsWith('@nick')) {
      //slice removes first item in array, shift returns first item in array
      ee.emit(command, client, data.toString().split(' ').slice(1).shift().trim());
      return;
    }

    if(command.startsWith('@dm')) {
      // console.log(data.toString().split(' ').slice(1).join(' '));
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
//remove from client pool
  socket.on('close', () => {
    //removes client from index; splice removes count item from specified index
    pool.splice(pool.indexOf(client),1);
    let leftUser = client.nickName;
    console.log(leftUser + ' has left the chat');
    return;
  });

  socket.on('error', (err) => {
    console.error('There was an error!', err);
  });

});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
