# Lab 6: TCP Chat Server

## Description
For this lab we created a basic TCP server and client that both run locally on your machine. A client can also connect to the host server from a different computer. When a client connects to the server, they are assigned a random name. Clients can see who else is in the chat room, change their nickname, and most importantly chat with each other.

* For more information see: [class 6](https://github.com/codefellows/seattle-javascript-401d15/tree/master/class-06-tcp-chat) and [lab 6](https://github.com/codefellows-seattle-javascript-401d15/lab-06-tcp-chat).

## Version
* 0.2.0

## Start the server
In [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) (Terminal) enter the command:

```server
nodemon server.js
```

## Connect with a client
In a new Terminal window enter the command:

```telnet
telnet localhost 3000
```
Open another window in Terminal and repeat the telnet command above to connect another client.

## Send Commands
In Terminal on the client:

* Enter `/all` to trigger a broadcast event.
* Enter `/nick new-nick-name-goes-here` to change your user nickname.
* Enter `/dm` to send a message directly to another user by nick name.
* Enter `/nick` to print your current nickname.

## Installation
Please visit the following pages for how to install your project locally.

* [Cloning A Repository](https://help.github.com/articles/cloning-a-repository/)
* [Fork A Repo](https://help.github.com/articles/fork-a-repo/)
* [Forking](https://guides.github.com/activities/forking/)

### NPM Packages
* [NPM Docs](https://docs.npmjs.com)
* [NPM package.json](https://docs.npmjs.com/files/package.json)

```npm install
npm init
npm install -S uuid
npm install -D mocha chai
```
### Dependencies
The result of installation above.

```npm result
"devDependencies": {
  "chai": "^3.5.0",
  "mocha": "^3.3.0"
},
"dependencies": {
  "uuid": "^3.0.1"
}
```
* nodemon server.js"

## Running Tests
In [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) (Terminal) enter the command:

```testing
npm run test
```

## Resources
* [OSI Model](https://en.wikipedia.org/wiki/OSI_model)
* [TCP Connection Walkthrough](https://www.youtube.com/watch?v=F27PLin3TV0)
* [Stream Handbook](https://github.com/substack/stream-handbook)
* [Node Stream](https://nodejs.org/docs/latest/api/stream.html)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/mmpadget/lab-06-tcp-chat/blob/lab-06/lab-padget/LICENSE) file for details.

## Acknowledgments
* Code Fellows
* Scott Schmidt, Instructor.
* Judy Vue, Lead Teaching Assistant.
* Thomas Martinez, Teaching Assistant.
