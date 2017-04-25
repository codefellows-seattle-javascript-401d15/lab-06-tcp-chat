'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000 ;

const pool = [];
let users = 0;

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  client.nickName = string.trim();
});

ee.on('/dm', (client, string) => {
  let receiver = string.split(' ')[0];
  let message = string.split(' ').slice(1).join(' ');
  pool.forEach(c => {
    if(c.nickName === receiver) {
      c.socket.write(`${c.nickName}: ${message}`);
    }
  });
});

ee.on('/wat', (client) => {
  pool.forEach(c => c.socket.write(`${client.nickName}:
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░
    ░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░
    ░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░
    ░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░
    ░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░
    ░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░
    ░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░
    ░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░
    ░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░
    ░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░
    ░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░
    ░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    `));
});

server.on('connection', socket => {

  users++;
  console.log(`Total Users : ${users}`);

  socket.nickname = 'User' + users;
  let clientName = socket.nickname;
  console.log(`${clientName} has joined the chat `);

  socket.write(`Hey! Welcome to SACK CHAT! Where Kids can chat with Adults without your parents knowing!\n`);
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`user_${client.userName} has connected!\n`));

  socket.on('data', data => {

    let command = data.toString().split(' ').shift().trim();

    if(command.startsWith('/')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());

  });

  socket.on('close', function () {
    console.log(`${clientName} has left the chat.`);
    removeSocket(socket);
  });

  socket.on('error', function(error) {
    console.log(`Socket has technical difficulties: ${error.message}`);
  });
});

function removeSocket (socket) {
  pool.splice(pool.indexOf(socket), 1);
}

server.on('error', err => {
  console.log('Oh Shit! Server has errors' + err.message);
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
