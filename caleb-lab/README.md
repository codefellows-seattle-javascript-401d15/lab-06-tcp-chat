# TCP Chat server application:

### Goals:
* Allow for a tcp chat through a node terminal
  * [but only if you like to talk to yourself]
* This application does require at least two terminal tabs!

### Setup:
Once you've forked the repo:
1. In your first window, type: ```npm i``` to install all dependencies
2. Then, enter ```npm start``` to run the local server
3. In your second window, type ```telnet localhost 3000```
  * [note: this can vary if you set a process.env.PORT variable, so be mindful of this.]
  * You should see a confirming message about your entry into the chat room.
  * You can close the server connections at any time with ```ctrl + c```

##### chat commands!
* ```@help``` to see available commands
* ```@me``` to see your visible username
* ```@nick insertnicknamehere``` to change your visible username
* ```@all insertmessagehere``` to message the WORLD!!
* ```@pm insertnicknamehere``` to message somebody privately
