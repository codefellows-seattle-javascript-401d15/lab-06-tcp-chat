'use strict';

const expect = require('chai').expect;
const serverJS = require('server.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

describe('server.js', function() {
  before(done => {
    server.listen(3000);
    done();
  });
  
  describe('new user joins the chat room', function() {
    it('should send a message to all other users already in the chat room', done => {
      let newUser = net.connect({port: 3000}, () => {
        newUser.once('data', function(data) {
          expect(data.toString()).to.include('has connected!');
        });
        newUser.end();
        done();
      });
    });
  });
  
  describe('error message on invalid command', function() {
    it('should tell the user the command was invalid and ask the user to try again', done => {
      
      done();
    });
  });
  
  describe('/nick command', function() {
    it('should allow the user to change their nickname', done => {
      
      done();
    });
  });
  
  describe('/dm command', function() {
    it('should allow the user to directly message another user', done => {
      
      
      done();
    });
  });
  
  after(done => {
    server.close();
    done();
  });
});