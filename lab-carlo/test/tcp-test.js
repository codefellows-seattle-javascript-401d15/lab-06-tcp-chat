'use strict';

const Client = require('../lib/client');
const server = require('../index.js');
const expect = require('chai').expect;
const net = require('net');

//const EE = require('events').EventEmitter;
//const ee = new EE();
//const server = net.createServer();
//const PORT = process.env.PORT || 3000;

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

  describe('/nick command', function() {
    let client = new Client();
    client.nickName = 'Carlo';

    it('Should change the client nickName to Carlo', done => {
      expect(client.nickName).to.equal('Carlo');
      done();
    });
    it('Should not say the clients nickName is BuzzKillington', done => {
      expect(client.nickName).to.not.equal('BuzzKillington');
      done();
    });
  });

  describe('/dm command', function() {

    it('should direct message a specific user by nickname', done => {
      let client = new Client();
      client.nickName = 'Carlo';
      let client2 = net.connect({port: 3000}, function() {
        client2.write('/dm Carlo hi');
        client2.on('data', data => {
          expect(data.toString().to.include('Carlo hi'));
        });
        done();
      });
    });
  });
});
