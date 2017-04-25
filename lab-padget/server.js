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

ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

server.on('connection', socket => {
  // Client code.
  let client = new Client(socket);
  pool.push(client);
  // Tell chat room someone has arrived.
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  // Whenever data starts to stream to sockets, do some stuff.
  socket.on('data', data => {
    // Shift to drop command off the front. Trim takes off white space (needs a string).
    let command = data.toString().split(' ').shift().trim();
    // Use event emitter.
    if(command.startsWith('/')) {
      // Join it back together on spaces.
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});


server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
