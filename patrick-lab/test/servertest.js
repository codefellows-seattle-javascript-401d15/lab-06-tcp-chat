'use strict';

const Client = require('../model/pages.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

describe('new user connecting to server', function(){
  describe('new client created and pushed to pool array', function(){
    server.on('connection', socket => {
      let client = new Client(socket);
      // pool.push(client);
      it('should create new Client object', function(){
        expect(client).to.be.an('object');
      });
    });
  });
});
