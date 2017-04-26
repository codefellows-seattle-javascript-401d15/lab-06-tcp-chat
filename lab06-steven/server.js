'use strict';

module.exports = function(){

  const Client = require('./model/client.js');
  const net = require('net');
  const EE = require('events').EventEmitter;
  const ee = new EE();
  const server = net.createServer();
  const PORT = process.env.PORT || 3000;

  const pool = [];

  ee.on('default', (client, string) => {
    client.socket.write(`Command Not Valid: ${string.split(' ', 1)}\n`);
  });

  ee.on('\\all', (client, string) => {
    pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
  });

  ee.on('\\nick', (client, string) => {
    client.nickName = string.split('\r').slice(0, 1).join();
    client.socket.write(`Nickname changed to: ${client.nickName}\n`);
  });

  ee.on('\\dm', (client, string) => {
    let desRec = string.split(' ').shift().toString();
    pool.forEach(c => {
      if (c.nickName == desRec) {
        c.socket.write(`${client.nickName}-DM: ${string.split(' ').slice(1).join(' ')}`);
      } 
    });
  });

  ee.on('error', (err) => {
    console.log(err, 'Error occured');
  });

  process.on('uncaughtException', (err) => {
    console.log(err, 'Uncaught Exception error!', pool);
  });

  server.on('connection', (socket) => {
    let client = new Client(socket);
    pool.push(client);
    pool.forEach(c => c.socket.write(`${client.nickName} has connected!\n`));

    socket.on('data', data => {
      let command = data.toString().split(' ').shift().trim();
      if (command.startsWith('\\')) {
        ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
        return;
      }
      ee.emit('default', client, data.toString());
    });

    socket.on('close', () => {
      let clientIndex = pool.indexOf(client);
      pool.splice(clientIndex, 1);
      pool.forEach(c => c.socket.write(`${client.nickName} has left the building.\n`));
    });
  });

  server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
}(module.exports);
