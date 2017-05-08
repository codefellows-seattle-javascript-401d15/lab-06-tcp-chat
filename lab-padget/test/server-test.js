'use strict';

// TODO: write tests which start your server, send and receive, and confirm functionality.

// TODO: ensure that all of your methods have test coverage.

// TODO: write tests which start your server, send and receive, and confirm functionality.

const server = require('../server');
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

// server.on('connection', socket => {
// let client = new Client(socket);
// pool.push(client);
// pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

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

      done();
    });
  });

  describe('bad whack command', function() {
    it('should respond with an invalid command statement', done => {

      done();
    });
  });

  // socket.on('data', data => {
  //   let command = data.toString().split(' ').shift().trim();
  //   if(command === '/all') {
  //     ee.emit('/all', client, data.toString().split(' ').slice(1).join(' '));
  //     return;
  //   }

  describe('/all command', function() {
    it('should message all clients', done => {

      done();
    });
  });

  // if(command === '/nick') {
  //   ee.emit('/nick', client, data.toString().split(' ').slice(1).join(' '));
  //   return;
  // }

  describe('/nick command', function() {
    it('should change the client nickname', done => {

      done();
    });
  });

  // if(command === '/dm') {
  //   ee.emit('/dm', client, data.toString().split(' ').slice(1).join(' '));
  //   return;
  // }

  describe('/dm command', function() {
    it('should direct message a specific user', done => {

      done();
    });
  });
});
