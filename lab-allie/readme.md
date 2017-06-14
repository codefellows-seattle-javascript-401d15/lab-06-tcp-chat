# TCP Chat System

By Allie Grampa
JS 401d15 course

### Purpose
The purpose of this system is the allow users to chat in terminal windows over an IP address or local host. This project was written using event emitters in Node.js. This chat system allows users to join a group chat, change their personal nickname, and directly message other users in the same chat system.

### Commands
The user can change their nickname from a randomized number to text of their choice by typing /nick then the nickname they want to use. 
For example: `/nick allie`

The user can send a message to everyone in the chat room by typing /all then the message they wish to send.
For example: `/all hello!`

The user can send a message directly to another user by typing /dm followed by the nickname and the message. 
For example: `/dm allie Hi!`

### Connecting
To join the server, the user should enter the IP address as `telnet IPaddress` or using the local host by entering `telnet PORT#`