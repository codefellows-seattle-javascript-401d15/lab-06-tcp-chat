
'use strict';

const expect = require('chai').expect;
const net = require('net');
const server = net.createServer();

describe('Server instance', function() {
  before('Listening on Port 3000', function(done) {
    server.listen(3000);
    done();
  });

  after('Close Server', function(done) {
    server.close();
    done();
  });

  describe('new client joins chat', function() {
    it('should notify other users that a new user has joined', done => {
      let client = net.connect({port: 3000}, () => {
        client.once('data', function(data) {
          expect(data.toString()).to.include('has connected! Nickname:');
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
          expect(data.toString()).to.include('Left room');
        });
        client.end();
        done();
      });
    });
  });
//
  describe('/all command', function() {
    it('should send message to all users', done => {
      let client = net.connect({port:3000}, function() {
        client.write('/all something');
        client.once('data', function(data){
          expect(data.toString()).to.include('something');
        });
        done();
      });
    });
  });

  describe('/nick command', function() {
    it('should change the client nickname', done => {
      let client = net.connect({port:3000}, function() {
        client.write('/nick Kevin');
        client.once('data', function(){
          expect(client.nickname).to.equal('Kevin');
        });
        done();
      });
    });
  });
});
