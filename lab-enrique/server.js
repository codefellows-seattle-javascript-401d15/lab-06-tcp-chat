'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module.exports = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];


ee.on('default',(client, string) => {
  client.socket.write(`Not a valid comment: ${string.split(' ', 1)}\n`);
});

ee.on('/all', (client,string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick',(client,string)=> {
  client.nickName = string.trim();
});

ee.on('/dm',(client,string)=>{
  let otherUser = string.split(' ')[0];
  let message = string.split(' ').slice(1).join(' ').trim();

  pool.forEach(c => {
    if(c.nickName === otherUser) {
      c.socket.write(`${c.nickName}: ${message}`);
    }
  });

});

server.on('connection', socket => {

  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has connected \n`));

  socket.on('data', data => {

    let command = data.toString().split(' ').shift().trim();

    if(command.startsWith('/')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });

  socket.on('close', function(){
    console.log(`${client.nickName} has left the chat.`);
    removeSocket(socket);
  });


  socket.on('error', function(error){
    console.log(`Error: ${error.message}`);
  });

});

function removeSocket (socket) {
  pool.splice(pool.indexOf(socket), 1);
}

server.listen(PORT,() => console.log(`listening on: ${PORT}`));
