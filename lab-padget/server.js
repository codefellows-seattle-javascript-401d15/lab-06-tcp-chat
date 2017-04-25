'use strict';

const Client = require('./model/client'); // Import client.
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE(); // Define and fire event for our chat.
const server = net.createServer(); // Create a server instance and assign it to server.
const PORT = process.env.PORT || 3000; // Variables that live on your machine.

const pool = [];

// Define event emitter.
ee.on('default', (client, string) => {
  // Feedback: not a valid command. Do something else.
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

// Trigger a broadcast event for everyone.
ee.on('/all', (client, string) => {
  pool.forEach(user => user.socket.write(`${client.nickName}: ${string}`));
});

// Allow a user create (change) their nickname.
ee.on('/nick', (instance, string) => {
  // Referring to same instance in memory.
  // instance.nickname = string.split(' ').slice(2).join(' ');
  let newNickName = `${string}`;
  instance.nickName = newNickName;
});

// Allow a user to send a message directly to another user by nick name.
// ee.on('/dm', (client, string) => {
//   pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
// });

// When a user types their nickname it should be printed. teapot: Sup Hacker?

// When sockets are connected with the ClientPool they should be given event listeners for data, error, and close events.
// When a socket emits the close event the socket should be removed from the client pool!
// When a socket emits the error event the error should be logged on the server
// When a socket emits the data event the data should be logged on the server and the \wack commands below should be implemented

server.on('connection', socket => {
  // Client code.
  let client = new Client(socket);
  pool.push(client);
  // Tell chat room someone has arrived.
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  // Whenever data starts to stream to sockets, do some stuff.
  socket.on('data', data => {
    // Shift to drop command off the front. Trim takes off white space.
    let command = data.toString().split(' ').shift().trim();
    // Use event emitter.
    // if(command.startsWith('/')) {
    //   // Join it back together on spaces.
    //   ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
    //   return;
    // }
    // also works with command instead of '/all'
    if(command === '/all') {
      ee.emit('/all', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    // doesn't work with command here, must have '/nick'
    if(command === '/nick') {
      ee.emit('/nick', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});


server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
