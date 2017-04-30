'use strict';

//const server = require('../index');
const expect = require('chai').expect;
const net = require('net');

//const Client = require('./lib/client');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

describe('Server instance', function() {
  before(done => {
    server.listen(3000);
    done();
  });

  after(done => {
    server.close();
    done();
  });

  describe('new client joins chat', function() {
    it('should notify other users that a new user has joined', done => {
      let client = net.connect({port: 3000}, () => {
        client.once('data', function(data) {
          expect(data.toString()).to.include('has joined the channel');
        });
        client.end();
        done();
      });
    });
  });

  describe('client leaves the chat', function() {
    it('should notify other users that a user has left the chat', done => {
      let client = net.connect({port: 3000}, () => {
        client.once('data', function(data) {
          expect(data.toString()).to.include('has left the channel');
        });
        done();
      });
    });
  });

  describe('/all command', function() {
    it('send a message to all clients in the client pool', done => {
      let client = net.connect({port: 3000}, () => {
        client.write('/all hello world');
        client.once('data', function(data) {
          expect(data.toString()).to.include('/all hello world');
        });
        done();
      });
    });
  });
  //
  // describe('/nick command', function() {
  //   it('should change the client nickname', done => {
  //
  //     done()
  //   })
  // })
  //
  // describe('/dm command', function() {
  //   it('should direct message a specific user', done => {
  //
  //     done()
  //   });
});
