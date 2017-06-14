'use strict';

const server = require('../server.js');
const chai = require('chai');
const expect = chai.expect;
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('../model/client');

describe('server.js', function(){

  before(done => {
    server.listen(3000);
    done();
  });

  after(done => {
    server.close();
    done();
  });

  describe('new client joins chat', function() {
    it('should notify other users that a new user has joined', done => {
      let client = net.connect({port: 3000}, () => {
        client.once('data', function(data) {
          expect(data.toString()).to.include('has connected');
          done();
        });
        client.end();
      });
    });
  });

  describe('@nick command', function() {
    it('should change the client nickname', (done) => {
      let user = new Client();
      ee.on('@nick', (client, string) => {
        client.nickName = string.trim();
      });
      ee.on('data', data => {
        let command = data.toString().split(' ').shift().trim();
        if(command.startsWith('@nick')) {
          ee.emit(command, user, data.toString().split(' ').slice(1).join(' '));
          return;
        }
      });
      ee.emit('@nick', user, '@nick teji'.toString().split(' ').slice(1).join(' '));
      expect(user.nickName).to.equal('teji');
      done();
    });
  });
});
