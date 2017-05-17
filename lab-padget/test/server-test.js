'use strict';

const server = require('../server');
const expect = require('chai').expect;
const net = require('net');

// test that server started.
describe('Server instance', function() {
  before(done => {
    server.listen(3000);
    done();
  });

  after(done => {
    server.close();
    done();
  });
});

describe('new client joins chat', function() {
  it('should notify other users that a new user has joined', done => {
    let client = net.connect({port: 3000}, () => {
      client.once('data', function(data) {
        expect(data.toString()).to.include('has connected!');
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
        expect(data.toString()).to.include(client.userName, 'disconnected from server');
      });
      client.end();
      done();
    });
  });
});

describe('bad whack command', function() {
  it('should respond with an invalid command statement', done => {
    let client = net.connect({port: 3000}, () => {
      client.once('data', function(data) {
        expect(data.toString()).to.include('Not a valid command:');
      });
      client.end();
      done();
    });
  });
});

describe('/all command', function() {
  it('should message all clients', done => {
    let client = net.connect({port: 3000}, () => {
      client.once('data', function(data) {
        expect(data.toString()).to.include(`${client.nickName}`);
      });
      client.end();
      done();
    });
  });
});

describe('/nick command', function() {
  it('should change the client nickname', done => {
    let client = net.connect({port: 3000}, () => {
      client.once('data', function(data) {
        expect(data.toString()).to.include(`${client.nickName}: Hey you!`);
      });
      client.end();
      done();
    });
  });
});

describe('/dm command', function() {
  it('should send text to a user', done => {
    let client = net.connect({port: 3000}, () => {
      client.once('data', function(data) {
        expect(data.toString()).to.be.a('string');
      });
      client.end();
      done();
    });
  });
});

describe('/dm command', function() {
  it('should direct message a specific user', done => {
    let client = net.connect({port: 3000}, () => {
      client.once('data', function(data) {
        expect(data.toString()).to.include(`${client.nickName}:`);
      });
      client.end();
      done();
    });
  });
});
