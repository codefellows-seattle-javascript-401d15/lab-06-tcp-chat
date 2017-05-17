'use strict';

// Import client.
const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
// Define and fire event for our chat.
const ee = new EE();
// Create a server instance and assign it to server.
const server = module.exports = net.createServer();
// Variables that live on your machine.
const PORT = process.env.PORT || 3000;

const pool = [];

// The eventEmitter.on() method is used to register listeners, while the eventEmitter.emit() method is used to trigger the event.

// Define event emitter.
ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

// Trigger a broadcast event for everyone.
ee.on('/all', (client, string) => {
  pool.forEach(user => user.socket.write(`${client.nickName}: ${string}\n`));
});

// Allow a user create or change their nickname.
ee.on('/nick', (client, string) => {
  client.socket.write(`${client.nickName}\n`);
  // Referring to the same instance in memory.
  let newNickName = `${string}`;
  // Set a new nickname.
  client.nickName = newNickName.trim();
  // Feedback to user nickname was set.
  client.socket.write(`${client.nickName}: Hey you!\n`);
});

// Allow a user to send a message directly to another user by nick name.
ee.on('/dm', (client, string) => {
  // target nickname
  let target = string.split(' ')[0];
  // message to send to nickname
  let message = string.split(' ').slice(1).join(' ');

  pool.forEach(msg => {
    if (msg.nickName === target) {
      msg.socket.write(`${client.nickName}: ${message}\n`);
    }
  });
});

server.on('connection', socket => {
  // Client code.
  let client = new Client(socket);
  pool.push(client);
  // Tell chat room someone has arrived.
  pool.forEach(c => c.socket.write(`${client.nickName} has connected!\n`));

  // event listeners for data, error, and close events
  socket.on('data', data => {
    // Shift to drop command off the front. Trim takes off white space.
    let command = data.toString().split(' ').shift().trim();

    if(command === '/all') {
      // log data on the server when a socket emits an event.
      console.log(`${client.nickName} broadcasted an event to everyone\n`);
      ee.emit('/all', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    if(command === '/nick') {
      console.log(`${client.userName} changed their nickname\n`);
      ee.emit('/nick', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    if(command === '/dm') {
      console.log(`${client.nickName} sent a direct message\n`);
      ee.emit('/dm', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });

  server.removeListener('connection', socket => {
    console.log('there was a close event');
    ee.emit(pool.pop(socket));
  });

  // register event listener for error event.
  socket.on('error', () => {
    console.log('an error event was registered');
    ee.emit('error', () => {
      console.log('there was an error event');
      console.error('logged error on server');
    });
  });

  // register event listener for close event.
  socket.on('close', () => {
    console.log(client.userName, 'disconnected from server');
    // remove from the client pool.
    ee.emit('close', (socket) => {
      console.log('there was a close event');
      console.log('on close, remove socket from client pool');
      ee.removeListener('connection', socket);
    });
  });

});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
