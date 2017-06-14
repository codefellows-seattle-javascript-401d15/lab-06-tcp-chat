# lab-06-tcp-chat

## About
This is a project to create, in a TDD/BDD manner, a TCP server using Node's net.js module.  

This will include:
- A client constructor, which will create a new instance when sockets connect to the server.
- Each client instance will have a unique id, which will be accomplished using Node's node-uuid module.

- Each client instance will have a unique nickName, such as guest-42.

- When sockets connect they have listeners for data, error, and close events.

 - ```close``` event must remove the socket from the client pool
 - ```error``` should be logged on the server
 - ```data``` should be logged to the server
 - ```\whack``` commands will be implemented as follows:

## commands
  - ```\all``` will trigger a broadcast event
  - ```\nick``` will allow a user to change their nickName
  - ```\dm``` will allow a user to send a message directly to another user.

Note: nickName will be printed along with all messages.
