'use strict';

const server = require('../server.js');
const net = require('net');
// const EE = require('events').EventEmitter;
//Not sure if I need to require anything else in... TBD.

describe('Server instance', function() {
  before(done => {
    server.listen(3000);
    done();
  });
  after(done => {
    server.close(3000);
    done();
  });
  describe('new client joins chat', function() {
    it('should notify other users that a new user has joined', done => {
      let client = net.connect({port: 3000}, () => {
        client.on('data', (data) => {
          console.log(data.toString());
        });
        done();
      });
    });
  });
});
