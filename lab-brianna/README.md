# Brianna Burrows
## Lab-06 TCP Chat Server

### Project
To make a simple Chatroom server using Node.js using Socket.io. This chatroom functions like many other instant messaging chat platforms that allow for multiple users to join the room, send a message to all other users, send direct messages to another user, change their 'nickname' and tell other user when a use leaves the room.

### Instructions To Run
To run the chatroom server, in your terminal, while in this directory, enter
```
node server.js
```
You should receive a console log that states 'Listening on: 4000'. This means the server is successfully running in Node.


### How to Connect To Server
Open a second terminal window and enter
```
tellnet localhost 4000
```
This will connect you as a new user to the server and display your username and nickname.
Open multiple terminal windows to see multiple user messages.

To change your nickname enter
```
/nick
```
followed by your new nickname

To send a message to everyone in the room enter
```
/all
```
followed by your message

To leave the chatroom enter
```
/close
```

Direct message sent to other user
```
/dm
```
Followed by the other users nickname, space and then the message
