'use strict';

const expect = require('chai').expect;
const net = require('net');
const server = net.createServer();

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
  
  describe('/nick command', function() {
    it('should allow the user to change their nickname', done => {
      let newUser = net.connect({port: 3000}, () => {
        newUser.write('/nick allie');
      });
      
      newUser.on('data', (data) => {
        expect(data.toString()).to.include('allie');
      });
      
      newUser.end();
      done();
    });
  });
  
  // describe('/dm command', function() {
  //   it('should allow the user to directly message another user', done => {
  //     
  //     
  //     done();
  //   });
  // });
  
  after(done => {
    server.close();
    done();
  });
});