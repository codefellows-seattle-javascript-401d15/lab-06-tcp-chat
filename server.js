'use strict';

const Client = require('./model/chat')
const net = require('net')
const EE = require('events').EventEmitter
const ee = new EE()
const server = net.createServer()
const PORT = process.env.PORT || 3000

const pool = []; //where the clients are added. //look @ docs, node net module create server

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command:${string.split(' ', 1)}`)
})

ee.on('@', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.username}: ${string}`))
})

server.on('connection', socket => {
  let client = new Client(socket)
  pool.push(client)
  pool.forEach(c => c.socket.write(`${client.nickname} has connected!\n`))
  socket.on('data', data => {
    let command = data.toString().split(' ', 1)
    if(command = '@') {
      ee.emit('@', client, data.toString().split(' ').shift().join(' '))
    }
    ee.emit('default', client, data)
  })
})




server.listen(PORT, () => console.log(`Listening on: ${PORT}`))
