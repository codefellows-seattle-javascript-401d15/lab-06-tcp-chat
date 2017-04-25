'use strict';

const Client = require(`./model/client.js`);
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
  pool.forEach(c => c.socket.write(`${client.nickName} : ${string}`));
});

ee.on('@nick', (client, string) => {
  client.nickName = string.trim();
});

ee.on('@pm', (client, string) => {
  // client.socket.write(c => {
  pool.forEach(function(c){
    if(c.nickName === string.split(' ').shift().trim()){
      client.socket.write(`to ${c.nickName}: ${string.split(' ').slice(1).join(' ')}`);
      c.socket.write(`from ${client.nickName}: ${string.split(' ').slice(1).join(' ')}`);
    }
  });
});



// //on data
// server.on('error', socket => {
//   pool.forEach();
// });
// //on close
// server.on('close', socket => {
//   pool.forEach();
// });
// //on exit
// server.on('error', socket => {
//   pool.forEach();
// });

//check the net module for the premade EventEmitters that exist on server
server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected! Samuel says: There are too many motha fuckin' clients on this motha fuckin' server!!11!\n`));

  socket.on('close', function(){
    (err) => console.log(err);
  });

  socket.on('error', err => {
    console.log(err);
  });

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    console.log(command);
    if(command.startsWith('@')){
      console.log(data.toString());
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });

});

server.listen(PORT, () => console.log(`Listening on: https://localhost:${PORT}, sucka`));
