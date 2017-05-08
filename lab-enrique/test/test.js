'use strict';

const Client = require('../model/client');
const server = require('../server.js');
const expect = require('chai').expect;
const net = require('net');

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
          expect(data.toString()).to.include('has connected');
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
          expect(data.toString()).to.include('has left the chat');
        });
        done();
      });
    });
  });

  describe('/all', function() {
    it('send a message to all clients in the client pool', done => {
      let client = net.connect({port: 3000}, () => {
        client.write('/all whats good');
        client.once('data', function(data) {
          expect(data.toString()).to.include('/all whats good');
        });
        done();
      });
    });
  });

  describe('/nick', function() {
    let client = new Client();
    client.nickName = 'Enrique';
    it('Should change the client nickName to Enrique', done => {
      expect(client.nickName).to.equal('Enrique');
      done();
    });
  });

  describe('/dm', function() {
    it('should direct message a specific user by nickname', done => {
      let client = new Client();
      client.nickName = 'Enrique';
      let clientTwo = net.connect({port: 3000}, function() {
        clientTwo.write('/dm Enrique YOOOO');
        clientTwo.on('data', data => {
          expect(data.toString().to.include('Enrique YOOOO'));
        });
        done();
      });
    });
  });
});
