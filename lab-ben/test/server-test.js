'use strict';

const expect = require('chai').expect;
const chat = require('./../server.js');
const net = require('net');

describe('Chat connection', function() {
  beforeEach(done => {
    chat.listen(3000);
    done();
  });
  afterEach(done => {
    chat.close(3000);
    done();
  });

  describe('#join chat', function() {
    it('should notify other users when a new user has connected', done => {
      let user = net.connect({port: 3000}, () => {
        user.on('data', data => {
          expect(data).exist;
        });
        done();
      });
    });
  });
  //does not work yet
  describe('#\\all chat', function() {
    it('should notify all users of the message', done => {
      let user = net.connect({port: 3000}, () => {
        user.on('data', data => {
          console.log(data.toString(), 'data');
        });
        done();
      });
    });
  });
});
