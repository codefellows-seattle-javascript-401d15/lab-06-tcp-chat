'use strict'

const Client = require(`./model/client.js`)
const net = require('net')
const EE = require('events').EventEmitter
const ee = new EE()
const server = module.exports = net.createServer()
const PORT = process.env.PORT || 3000

const pool = []

function removeSocket(socket){
  pool.splice(pool.indexOf(socket), 1)
}

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`)
})

ee.on('@all', (client, string) => {
  if(!client.nickName) pool.forEach(c => c.socket.write(`${client.userName} : ${string}`))
  if(client.nickName) pool.forEach(c => c.socket.write(`${client.nickName} : ${string}`))
})

ee.on('@nick', (client, string) => {
  client.nickName = string.trim()
  client.socket.write(`Samuel says: you have just changed your name to '${client.nickName}', motha fucka!!\n`)
})

ee.on('@me', client => {
  if(!client.nickName) client.socket.write(`You don't have a name! You got a numba: '${client.userName}'!\n`)
  if(client.nickName) client.socket.write(`You don't know yo name is '${client.nickName}'?!\n`)
})

ee.on('@pm', (client, string) => {
  pool.forEach(function(c){
    if(c.nickName === string.split(' ').shift().trim()){
      client.socket.write(`to ${c.nickName}: ${string.split(' ').slice(1).join(' ')}`)
      c.socket.write(`from ${client.nickName}: ${string.split(' ').slice(1).join(' ')}`)
    }
  })
})

ee.on('@help', (client) => {
  client.socket.write(`Commands:\nGlobal Channel: @all (message)\nPrivate message: @pm (username)\nChange nickname: @nick (name)\nView your name: @me\n`)
})

server.on('connection', socket => {
  let client = new Client(socket)
  pool.push(client)
  pool.forEach(c => c.socket.write(`${client.userName} has connected! Samuel says: There are too many motha fuckin' clients on this motha fuckin' server!!11!\n`))
  pool.forEach(c => c.socket.write(`type @help for commands.\n`))

  socket.on('error', err => {
    if(err) throw err
  })

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim()
    if(command.startsWith('@')){
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '))
      return
    }
    ee.emit('default', client, data.toString())
  })

  socket.on('close', function(){
    console.log(`${client.nickName} has left the room.\n`)
    removeSocket(socket)
    pool.forEach(c => `${c.nickName} has left the room.\n` )
    console.log('this is the new pool', pool)
  })
})

server.listen(PORT, () => console.log(`Listening on: https://localhost:${PORT}, sucka`))
