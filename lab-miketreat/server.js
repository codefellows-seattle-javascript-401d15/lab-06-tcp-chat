'use-strict';
const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = module.exports = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

// Default event that fires when all other events fail.
ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

// Welcome message for the user on entering the room.
ee.on('%!welcome', client =>{
  client.socket.write(`\n\nWELCOME! Here's a quick list of our commands! Type /help for more info! \n\n /all \n /nick or /n\n /room \n /dm\n /help\n /exit\n\n\n`);
});

// Lets a user send a message to the room.
ee.on('/all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}\n`));

});

//Sets the user's nickname and changes their setName to true allowing them to DM and be DMd.
ee.on('/n', (client, string) => {
  let newName = string.split(' ').shift().trim();
  let successFlag = true;
  if (newName === '') {
    client.socket.write('Sorry, you must enter a character!\n');
    return;
  }
  pool.forEach(c =>{
    if(c.nickName === newName){
      client.socket.write(`Sorry, that name is taken! You can add numbers to the name if you like!\n`);
      successFlag = false;
      return;
    }
  });
  if(successFlag === true){
    let oldName = client.nickName;
    client.nickName = newName;
    client.setName = true;
    pool.forEach(c => c.socket.write(`${oldName} has changed their name to ${client.nickName}\n`));
  }
});

// lets a user direct message another user. Both users must have set a nick name first.
ee.on('/dm', (client, string) =>{
  if(client.setName === false) return;
  let otherUser = string.split(' ').slice(1).join(' ');
  console.log(otherUser);



});


ee.on('/exit', client =>{
  let user = client.nickName;
  pool.forEach(c => {
    if(c.userName === client.userName){
      console.log(pool);
      pool.splice(pool.indexOf(c),1);
      console.log(pool);
    }
  });
  client.socket.end();
  pool.forEach(c => c.socket.write(`${user} Has left the chatroom\n`));
});

ee.on('/p', () =>{
  pool.forEach(c =>{
    console.log(c.nickName);
    c.socket.write('success');
  });
});

ee.on('/r', client =>{
  let currentPool = [];
  let currentClient;
  pool.forEach(c =>{
    if(client.userName === c.userName){
      currentClient = (` You --> ${c.nickName}`);
    }else{
      currentPool.push(` ${c.nickName}`);
    }
  });
  currentPool.push(currentClient);
  client.socket.write(`Current Members in this chatRoom: ${currentPool}\n`);
});

ee.on('/help', client =>{
  client.socket.write(`\n\n Quick Commands:\n /all\n /nick\n /dm\n /exit\n\n All commands begin with a forward-slash ( / ). Example: /all \n\n Some commands require the command followed by a single word. If you see a command that has a following word wrapped like *this* that means whatever you type after the command will be used by that command.\n\nList of commands:\n\n /all - Lets you send a message to all users.\n\n /nick *name* - This allows you to change your name.\n\n /dm *username* - Allows you to send a private message to a user.\n\n /help shows a list of all commands\n\n /exit This lets you leave the chatroom`);
});

// quick route for /nick
// ee.on('/n', (client, string) => {
//   let newName = string.split(' ').shift().trim();
//   if (newName === '') {
//     client.socket.write('Sorry, you must enter a character!');
//     return;
//   }
//   pool.forEach(c =>{
//     if(c.nickName === newName){
//       client.socket.write(`Sorry, that name is taken! You can add numbers to the name if you like!`);
//       return;
//     }
//     let oldName = client.nickName;
//     client.nickName = newName;
//     pool.forEach(c => c.socket.write(`${oldName} has changed their name to ${client.nickName}\n`));
//   });
// });

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.niName} has connected!\n`));

  ee.emit('%!welcome', client);
  ee.emit('/r', client);

  socket.on('data', data =>{
    console.log(data.toString());
    let command = data.toString().split(' ').shift().trim();
    console.log(command);

    if(command.startsWith('/')){
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});


server.listen(PORT, () => console.log(`You are on Port : ${PORT}`));
