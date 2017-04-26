'use strict';

const Client = require ('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module.export = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

server.listen(PORT, () => console.log(`listening on: ${PORT}`));

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

//sends a message to all users
ee.on ('\\all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
})

//changes a user's nickname
ee.on('\\nick', (client, newName) => {
client.nickName = newName.trim();//trim removes all the white space
client.socket.write(`Your nickname has been changed to ${client.nickName}\n`);
  });

//sends a message to a single user
ee.on('\\dm', (client, string) => {
  let toUser = pool.find(u => {
    return u.nickName === string.split(' ').shift().trim();
  });
  let message = string.split(' ').slice(1).join(' ');
  if (toUser) {
    client.socket.write(`To ${toUser.nickName}: ${message}`);
    toUser.socket.write(`From ${client.nickName}: ${message}`);
    return;
  }
});



server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split('').shift().trim();
    if (command.startsWith('\\')) {
      ee.emit(command, client, data.toString().split('').slice(1).join(''));
      return;
    }


    if (command.startsWith('\\nick')) {
      ee.emit(command, client, )
      return;
    }

    if (command.startsWith('\\dm')) {
      ee.emit(command, client, )
      return;
    }

    if (command.startsWith(`${nickName}`)) {
      ee.emit(command, client, )
      return;
    }

    socket.on('close', () => {
      pool.forEach((c, index) => {
        let TempUser = client.userName;
        if (c.userName === client.userName) {
          pool.splice(index, 1);
        }
        console.log(`${Tempuser} has left chat.`);
      });
      console.log(`${pool}`);
    });
    socket.on('error', () => {
      console.log('There is an error!');
    });

    ee.emit('default', client, data.toString());
  });
});
