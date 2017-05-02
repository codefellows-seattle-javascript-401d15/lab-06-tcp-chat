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
    if(c.nickName.toLowerCase() === newName.toLowerCase()){
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

  // Checks if the client has set a nick name.
  if(client.setName === false){
    client.socket.write('Sorry, you must first make a user name! Use /n to set a user name! Try /help for more info!\n');
    return;
  }

  let selectedUser = string.split(' ').slice(0,1);
  selectedUser = selectedUser.toString().toLowerCase();

  // Checks if they are trying to send a message to themsevles and stops them.
  if(selectedUser === client.nickName.toLowerCase()){
    client.socket.write('Sorry, you can send a dm to other users but not to yourself!\n');
    return;
  }

  // Checks if the selected user is a real user.
  let foundUserFlag = false;
  pool.forEach(c =>{
    if(selectedUser === c.nickName.toLowerCase()){
      selectedUser = c;
      foundUserFlag = true;
    }
  });

  if(foundUserFlag === false)client.socket.write(`\n Sorry, we can't find ${selectedUser} Names are not case sensitive, so double check the spelling!\n`);

  // Final Check. Checks if the other user has set a username.
  if(selectedUser.setName){
    let data = string.split(' ').slice(1).join(' ');
    selectedUser.socket.write(`Private Message:\n ${client.nickName} says: ${data}\n`);
    client.socket.write(`Message To ${selectedUser.nickName}: ${data}\n`);
    return;
  }
  client.socket.write(`Sorry, ${selectedUser.nickName} hasn't set a user name. You can try asking them in chat to set one if you want to send them a private message!\n`);

});

// Lets a user exit the chat.
ee.on('/exit', client => client.socket.end());

// Lets a user see all the userNames in the room.
ee.on('/room', client =>{
  let currentPool = [];
  let currentClient;

// Finds the user and waits to push them to the end of the list.
  pool.forEach(c =>{
    if(client.userName === c.userName){
      currentClient = (` You: ${c.nickName}`);
    }else{
      currentPool.push(` ${c.nickName}`);
    }
  });
  currentPool.push(currentClient);
  client.socket.write(`Current Members in this chatRoom: ${currentPool}\n`);
});

// Displays the help section.
ee.on('/help', client =>{
  client.socket.write(`\m\m-------------------\n\n Quick Commands:\n /all\n /room\n /nick\n /dm\n /exit\n\n All commands begin with a forward-slash ( / ). Example: /all \n\n Some commands require the command followed by a single word. If you see a command that has a following word wrapped like *this* that means whatever you type after the command will be used by that command.\n\nList of commands:\n\n /nick *name* - This allows you to change your name.\n\n /all - Lets you send a message to the room.\n\n /room - This lets you see all current users in the room.\n\n /dm *username* <message> - Allows you to send a private message to a user. You must both have a user name set! \n\n /help shows a list of all commands\n\n /exit This lets you leave the chatroom\n\n------------------------\n\n\n`);
});

// Dev helper to show current names in pool.
// ee.on('/p', client =>{
//   let tempPool = [];
//   pool.forEach(c =>{
//     tempPool.push(c.nickName);
//   });
//   console.log(tempPool);
//   client.socket.write('success');
// });

// When the server receives a connection Event it makes a new socket with our client constriction bound to it. The socket.on is attached to the server and when it gets a data event it handles that event by parsing out the first word and then emitting the event that matches that word. It also passes the client
server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has connected!\n`));

  ee.emit('%!welcome', client);
  ee.emit('/room', client);

  // Listener for any data that a socket sends.
  socket.on('data', data =>{
    let command = data.toString().split(' ').shift().trim();
    console.log(`${client.nickName}'s command: ${command}'`);

    if(command.startsWith('/')){
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });

  // When a user types exit it will end that socket. This handles that.
  socket.on('end', () => {
    console.log(`${client.nickName} ended their connection.`);
  });

  // When a user types /exit or closes the socket this handles that event.
  socket.on('close', () =>{
    let name = client.nickName;

    // Removes the client from the pool.
    pool.splice(pool.indexOf(client),1);

    // Lets the room know who left.
    pool.forEach(c => {
      c.socket.write(`${name} has left the room.\n`);
    });
  });

  socket.on('error', (err)=>{
    console.log(`socket.on error - ${err}`);
  });
});


server.listen(PORT, () => console.log(`You are on Port : ${PORT}`));
