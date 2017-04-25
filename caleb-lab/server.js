'use strict';

const Client = require(`./model/client.js`);
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module.exports = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

function removeSocket(socket){
  pool.splice(pool.indexOf(socket), 1);
}

//if no commmand is present
ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});
//if they're sending a message to the channel
ee.on('@all', (client, string) => {
  //for every existing socket in the pool
  pool.forEach(c => c.socket.write(`${client.nickName} : ${string}`));
});
//to change nickname
ee.on('@nick', (client, string) => {
  //the string you argue minus whitespace = their nickname
  client.nickName = string.trim();
  client.socket.write(`Samuel says: you have just changed your name to '${client.nickName}', motha fucka!!`);
});
//to private message another user
ee.on('@pm', (client, string) => {
  pool.forEach(function(c){
    //if the string you entered as their name = their nickname,
    if(c.nickName === string.split(' ').shift().trim()){
      //print your message on your screen
      client.socket.write(`to ${c.nickName}: ${string.split(' ').slice(1).join(' ')}`);
      //print your message on their screen
      c.socket.write(`from ${client.nickName}: ${string.split(' ').slice(1).join(' ')}`);
    }
  });
});
//to get the commands
ee.on('@help', (client) => {
  client.socket.write(`Commands:\nGlobal Channel: @all (message)\n Private message: @pm (username)\nChange nickname: @nick (name)\n`);
});

//check the net module for the premade EventEmitters that exist on server
server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected! Samuel says: There are too many motha fuckin' clients on this motha fuckin' server!!11!\n`));
  pool.forEach(c => c.socket.write(`type @help for commands.\n`));

  socket.on('error', err => {
    if(err) throw err;
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

  socket.on('close', function(){
    console.log(`${client.nickName} has left the room.\n`);
    pool.forEach(client.socket.write(`${client.nickName} has left the room.\n`));
    removeSocket(socket);
  });
});

server.listen(PORT, () => console.log(`Listening on: https://localhost:${PORT}, sucka`));
