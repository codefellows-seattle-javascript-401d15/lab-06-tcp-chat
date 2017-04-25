'use strict';

const Client = require('./model/client.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;
const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.nickName = string.trim();
  pool.forEach(c => c.socket.write(`You changed your nickname to: ${client.nickName}\n`));
});

ee.on('/dm', (client, string) => {
  pool.forEach(receiver => {
    client.socket.write(`To ${receiver.nickName}: ${string.split(' ').slice(1).join(' ')}`);
    receiver.socket.write(`From ${client.nickName}: ${string.split(' ').slice(1).join(' ')}`);
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

  socket.on('error', err => {
    if(err) throw err;
  });

//   socket.on('close', )
});


server.listen(PORT, () => console.log(`Listening on PORT ${PORT}!`));
