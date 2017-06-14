'use strict';

const expect = require('chai').expect;
const testServer = require('../server.js');
const TestClient = require('../model/client.js');
const net = require('net');
const Client = require('../model/client');

describe('server tests', function() {

  before(done => {
    testServer.listen(3000);
    this.client = new TestClient();
    done();
  });
  after(done => {
    testServer.close(3000);
    done();
  });

  describe('client announced when joining chat', function() {

    it('should notify the room that a new user is joined', done => {
      let newClient = net.connect({port: 3000}, () => {
        newClient.once('data', (data) => {
          expect(data.toString()).to.include('has connected');
          done();
        });
        newClient.end();
      });
    });
  });
  describe('commands to server', function() {

    let client1 = new Client();
    client1.nickName = 'guest-42';

    describe('nick name change command', function() {

      it('should register the nick name', done => {
        expect(client1).to.have.property('nickName')
        .that.is.a('string')
        .that.equals('guest-42');
        done();
      });

      it('should register the new nick name after the command /nick', done => {
        let connectClient1 = net.connect({port: 3000}, () => {
          connectClient1.write('/nick TEST');
          connectClient1.on('write', (data) => {
            expect(data.toString()).to.include('TEST');
            expect(client1.nickName).to.equal('TEST');
          });
          done();
        });
      });

    });
    describe('all command', function(err) {
      if(err) throw err;

      it('should broadcast a message', function(done) {
        let connectClient1 = net.connect({port: 3000}, function() {
          connectClient1.write('/all Hello everyone');
          connectClient1.on('data', function(data) {
            expect(data.toString()).to.include('Hello everyone');
          });
          done();
        });
      });
    });
    describe('dm command', function(err) {
      if(err) throw err;

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
});
