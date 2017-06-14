![cf](https://i.imgur.com/7v5ASc8.png) lab-06-tcp-chat-server
======

## About
This application is a TCP Chat Server created using the Node.js net module. Each user creates a connection to the server via a socket endpoint through telnet, which allows them to communicate with each other.

## Starting the Application
You will need to have Node.js installed before starting the application. Clone this repository and navigate to the root directory `$ cd lab-shelly`. Install the dependencies (e.g., node-uuid) `$ npm i`. Run the server file `$ npm start`.

## Connecting to the Chat Server
Run telnet and include your IP address and localhost port. For example:
```
telnet 192.168.1.9 3000
```
# Chat commands
* `@all <message>` triggers a broadcast event. e.g., `@all hello!`
* `@nick <new nickname>` should allow a user change their nickname. e.g., `@nick shelly`
* `@dm <user nickname> <message>` should allow a user to send a message directly to another user by nickname. e.g., `@dm shelly how are you?` sends a direct message to user shelly.
