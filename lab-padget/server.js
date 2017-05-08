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

// Define event emitter.
ee.on('default', (client, string) => {
  // Feedback: not a valid command. Do something else.
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
  client.socket.write(`${client.nickName}: Sup Hacker?\n`);
});

// Allow a user to send a message directly to another user by nick name.
ee.on('/dm', (client, string) => {

  // target nickname
  let target = string.split(' ')[0];

  // message to send to nickname
  let message = string.split(' ').slice(1).join(' ');

  pool.forEach(ctx => {
    if (ctx.nickName === target) {
      ctx.socket.write(`${client.nickName}: ${message}\n`);
    }
  });
});

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

    // ee.on('data', data => {
    //   console.log('log data event from socket: ', data);
    // });

    if(command === '/all') {
      ee.emit('/all', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    if(command === '/nick') {
      ee.emit('/nick', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    if(command === '/dm') {
      ee.emit('/dm', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });

  // socket.on('custom', () => {
  //   ee.emit('error', () => {
  //     console.log('there was an error event ');
  //     console.error('logged error on server');
  //   });
  //
  //   ee.emit('close', () => {
  //     console.log('there was a close event ');
  //   });
  //
  //   ee.emit('end', () => {
  //     console.log('on close, remove socket from client pool ');
  //   });
  // });

  socket.on('end', () => {
    console.log(client.userName, 'disconnected from server');
  });

  // socket.on('end', () => {
  //   console.log(client.userName);
  // });
});


/*
server.on('error', (err) => {
  // try, catch?
  throw err;
});


When client disconnects, the server throws this error:

Listening on: 3000
21d3b379-51ec-43f3-b58d-c2f83cfcb59a disconnected from server
events.js:160
      throw er; // Unhandled 'error' event
      ^
Error: This socket has been ended by the other party
    at Socket.writeAfterFIN [as write] (net.js:294:12)
    at pool.forEach.c (/Users/michaelpadget/CodeFellows/401/labs/lab-06-tcp-chat/lab-padget/server.js:58:30)
    at Array.forEach (native)
    at Server.server.on.socket (/Users/michaelpadget/CodeFellows/401/labs/lab-06-tcp-chat/lab-padget/server.js:58:8)
    at emitOne (events.js:96:13)
    at Server.emit (events.js:188:7)
    at TCP.onconnection (net.js:1468:8)

Most likely because there are no longer any clients in the pool.
*/

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));

/*
server.listen(3000, () => {
  console.log('server bound');
});

To listen on the socket /tmp/echo.sock the third line from the last would just be changed to

server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
*/
