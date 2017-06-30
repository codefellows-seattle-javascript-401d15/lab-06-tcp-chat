'use strict';

const Client = require('../model/client');
const expect = require('chai').expect;
const net = require('net');
const server = net.createServer();

describe('check if server is running', function() {
  before('Server on Port 4000', function(done) {
    server.listen(4000);
    done();
  });

  after('Close Server', function(done) {
    server.close();
    done();
  });

  describe('chat commands work', function(){
    describe('/nick', function() {
      let testUser = new Client();
      testUser.nickName = 'Scott';
      it('should use Scott as the new nickname', done => {
        expect(testUser.nickName).to.be.equal('Scott');
        done();
      });
    });
    describe('/all', function() {
      it('should send a message to all users', done => {
        let user = net.connect({port: 4000}, function() {
          user.write('/all hi');
          user.on('data', function(data) {
            expect(data.toString()).to.include('hello');
          });
          done();
        })
      })
    })
    describe('/dm', function() {
      it('should send a message from test user 1 to test user 2', done => {
        let testUser1 = new Client();
        testUser1.nickName = 'User 1';

        let testUser2 = new Client();
        testUser2.nickName = 'User 2';

        let user = net.connect({port: 4000}, function() {
          user.write('/dm User 2 Hello');
          user.on('data', data => {
            expect(data.toString()).to.include('User 2 Hello');
          });
          done();
        });
      });
    });
  });
});
