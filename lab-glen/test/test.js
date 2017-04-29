'use strict';

const Client = require('../model/client');
const expect = require('chai').expect;
const net = require('net');
const server = require('../server.js');

describe('Server function check', function() {
  before('Listening on Server Port 3000', function(done) {
    server.listen(3000);
    done();
  });

  after('Close server', function(done) {
    server.close();
    done();
  });

  describe('Chat Commands', function() {

    describe('/all', function() {
      it('should send a message to all users', done => {
        let client = net.connect({port: 3000}, function() {
          client.write('/all hello');
          client.on('data', function(data) {
            expect(data.toString()).to.include('hello');
          });
          done();
        });
      });
    });

    describe('/nick', function() {
      let testClient = new Client();
      testClient.nickName = 'Roger';
      it('should read Roger as the new nickname', done => {
        expect(testClient.nickName).to.be.equal('Roger');
        done();
      });
      it('should allow the client to change nickname', done => {
        let client = net.connect({port: 3000}, function () {
          client.write('/nick roidrage');
          client.on('data', function(data) {
            expect(testClient.nickName).to.be.equal('roidrage');
            expect(data.toString()).to.include('roidrage');
          });
          done();
        });
      });
    });

    describe('/dm', function() {
      it('should send a message from test client 1 to test client 2', done => {
        let testClient1 = new Client();
        testClient1.nickName = 'Client 1';

        let testClient2 = new Client();
        testClient2.nickName = 'Client 2';

        let client = net.connect({port: 3000}, function () {
          client.write('/dm Client 2 hello');
          client.on('data', data => {
            expect(data.toString()).to.include('Client 2 hello');
          });
          done();
        });
      });
    });

    describe('/wat', function() {
      it('should display nyan cat', done => {
        let client = net.connect({port: 3000}, function () {
          client.write('/wat');
          client.on('data', data => {
            expect(data.toString()).to.include('░░░░░░░');
          });
          done();
        });
      });
    });
  });
});
