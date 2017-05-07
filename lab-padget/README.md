# Lab 6: TCP Chat Server

## Description
For this lab we created a basic server and client that both run locally on your machine. A client can also connect to the host server from a different computer. When a client connects to the server, they are assigned a random name. Clients can see who else is in the chat room, change their nickname, and most importantly chat with each other.

* For more information see: [class 6](https://github.com/codefellows/seattle-javascript-401d15/tree/master/class-06-tcp-chat) and [lab 6](https://github.com/codefellows-seattle-javascript-401d15/lab-06-tcp-chat).

## Version
* 0.2.0

## Installation
Please visit the following pages for how to install your project locally.

* [Cloning A Repository](https://help.github.com/articles/cloning-a-repository/)
* [Fork A Repo](https://help.github.com/articles/fork-a-repo/)
* [Forking](https://guides.github.com/activities/forking/)

In [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) (Terminal)

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

## Running the Tests
In [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) (Terminal)

```testing
npm run test
```

## Resources
* [OSI Model](https://en.wikipedia.org/wiki/OSI_model)
* [TCP Connection Walkthrough](https://www.youtube.com/watch?v=F27PLin3TV0)
* [Stream Handbook](https://github.com/substack/stream-handbook)
* [Node Stream](https://nodejs.org/docs/latest/api/stream.html)

## License

This project is licensed under the MIT License.

## Acknowledgments
* Code Fellows
* Scott Schmidt, Instructor.
* Judy Vue, Lead Teaching Assistant.
* Thomas Martinez, Teaching Assistant.
