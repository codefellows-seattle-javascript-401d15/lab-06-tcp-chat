'use strict';

const server = require('../server');
const expect = require('chai').expect;
const net = require('net');

describe('Server is running', () => {
  before(done => {
    server.listen(3000);
    done();
  });

  after(done => {
    server.close();
    done();
  });

  describe('Someone has joined', () => {
    it('Should notify all users that Someone new has connected', done => {
      let user = net.connect({port: 3000}, () => {
        user.once('data', (data) => {
          expect(data.toString()).to.include('has connected');
        });
        user.end();
        done();
      });
    });
  });
});
