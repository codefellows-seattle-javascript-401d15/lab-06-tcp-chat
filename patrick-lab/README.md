# Patrick Sheridan
## Lab-06 TCP Chat Server

### Project
To make a simple Chatroom server in node.js using socket.io. This chatroom would function like other chatrooms in that it would allow for multiple users to join the room, send a message to all other users, send direct messages to another user, change their 'nickname' and tell other user when a use leaves the room.

### Instructions To Run
To run the chatroom server, in your terminal, while in this directory, enter 
```
nodemon server.js 
```
You should recive a console log that states 'Listening on: 3000'. This means the server is successfully running in node.


### How to Connect To Server
Open a second terminal window and enter
```
tellnet localhost 3000
```
This will connect you as a new user to the server and display your username and nickname.
Open multiple terminal windows to see multiple user messages.

