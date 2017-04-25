
![cf](https://i.imgur.com/7v5ASc8.png) lab-06-tcp-chat-server
======

# About TCP Chat Server
The TCP chat server allows users to communicate with other others using commands written into the command line of their terminals. Using TCP protocol, the users are able to communicate in real-time. Users are able to broadcast messages to all users, direct message specific users, and change their automated nicknames. 

## Connect to Server Directions
1. The admin must install file resources in local copy by running `npm init` in their command line.
2. The admin must run the file on localhost: 3000 by running the command `nodemon server` in their command line.
3. Users on the same computer may log into the program by running `telnet localhost 3000` in their command line.
4. Logged-in users should see a notification that they have logged in, as well as a notification when new guests join, such as `Guest-68 has connected!`

## Command Directions
* To send a message to all users simply type `/all <message>` into the command line.
* To change the nickname, users simply type `/nick <nickname>` into the command line.
  * NOTE: all usernames will be reverted to uppercase.
* To send a direct message, users type `/dm <username of other user> <message>` into the command line.

### Resources
* Mocha
* Chai
* Node-uuid
* EventEmitter
