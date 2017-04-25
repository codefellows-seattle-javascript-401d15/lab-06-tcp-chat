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
    server.close();
    done();
  });

  describe('new client joins chat', function() {
    it('should notify other users that a new user has joined, and that there will be an @help instruction', done => {
      let client = net.connect({port: 3000}, () => {
        client.once('data', (data) => {
          console.log(data.toString());
          expect(data.toString()).to.include('has joined');
          expect(data.toString()).to.include('@help for commands');
        });
        done();
      });
    });
  });

  describe('@nick', function() {
    it('should tell you that your tell your name changed', done => {
      let client = net.connect({port: 3000}, () => {
        client.write('@nick to change name' + 'plschangeme');
        client.on('data', (data) => {
          expect(data.toString()).to.include('changed your name to');
          console.log(data.toString());
        });
        done();
      });
    });

    describe('@help for commands', function() {
      it('should list the different commands', done => {
        let client = net.connect({port: 3000}, () => {
          // client.write('@nick ' + 'plschangeme');
          client.write('@help');
          client.on('data', (data) => {
            expect(data.toString()).to.include('@nick', '@pm', '@all');
            console.log(data.toString());
          });
          // client.end();
          done();
        });
      });
    });

    describe('@all to say to all', function() {
      it('should print to all', done => {
        let client = net.connect({port: 3000}, () => {
          // client.write('@nick ' + 'plschangeme');
          client.write('@all Hello world');
          client.on('data', (data) => {
            expect(data.toString()).to.include('@nick', '@pm', '@all');
            console.log(data.toString());
          });
          // client.end();
          done();
        });
      });
    });
  });
});

// expect(client.socket.write(`@all this should print things.`).to.be.equal.to(`this should print things.`));
