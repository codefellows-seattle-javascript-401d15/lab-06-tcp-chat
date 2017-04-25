## Lab 06 TCP Chat
  This program enables user to initiate a TCP chat within the terminal. Other users are able to join and type messages to each other similar to a chat-room.

## Directions
* Run the command `$ npm install -S node-uuid` in terminal to save and install node-uuid
* Open a new tab in Terminal and run `$ nodemon server.js`
* In the original tab run the command `$telnet <your_ip_address> <port number>`

# Wack commands `'\'`
* `\all` followed by a message will allow user to broadcast a message to chat channel
* `\nick` followed by a string will allow user to change nickname to the specified string
* `\dm` followed by a different user's nickname and the message, will allow user to send a direct message to the other user.
