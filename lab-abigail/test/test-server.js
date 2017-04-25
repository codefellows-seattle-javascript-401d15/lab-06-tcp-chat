'use strict';

const expect = require('chai').expect;
const net = require('net');
const client = new net.Socket();
const server = require('../server.js');
const Client = require('../model/client.js');
const EE = require('events').EventEmitter;
const ee = new EE();

describe('Client Test', function() {
  before('Listening on Server', function(done) {
    server.listen(3000);
    done();
  });

  after('Close server', function(done) {
    server.close();
    done();
  });

  describe('Command Testing', function(err) {
    if(err) throw err;
    describe('nick command', function(err) {
      if(err) throw err;

      let client1 = new Client();
      client1.nickName = 'Guest-34';

      it('should register the client nickname', function(done) {
        expect(client1.nickName).to.be.equal('Guest-34');
        done();
      });

      it('should change the client nickname', function(done) {
        let connect = net.connect({port: 3000}, function() {
          connect.write('/nick test');
          connect.on('data', function(data) {
            expect(data.toString()).to.include('test');
            expect(client1.nickName).to.be.equal('test');
          });
          done();
        });
      });
    });

    describe('all command', function(err) {
      if(err) throw err;

      it('should broadcast a message', function(done) {
        let connect = net.connect({port: 3000}, function() {
          connect.write('/all Hello everyone');
          connect.on('data', function(data) {
            expect(data.toString()).to.include('Hello everyone');
          });
          done();
        });
      });
    });

    it('should send a dm', function(done) {

      let client1 = new Client();
      client1.nickName = 'Guest-34';

      let client2 = new Client();
      client2.nickName = 'Guest-50';

      let connect = net.connect({port: 3000}, function() {
        connect.write('/dm test');
        connect.on('data', function(data) {
          expect(data.toString()).to.include('test');
          expect(data.toString()).to.include('Guest-34');
          expect(data.toString()).to.include('Guest-50');
        });
        done();
      });
    });
  });
});
