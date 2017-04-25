'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const Client = require(`../model/client.js`);
const server = require(`../server.js`);
const net = require('net');

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
  describe('new nickname chosen', function() {
    it('should tell you that your tell your name changed', done => {
      // let client = net.connect({port: 3000}, () => {
        client.write('@nick' + 'plschangeme');
        client.on('data', (data) => {
          console.log(data.toString());
        });
      });
      done();
    });
  });

// expect(client.socket.write(`@all this should print things.`).to.be.equal.to(`this should print things.`));
