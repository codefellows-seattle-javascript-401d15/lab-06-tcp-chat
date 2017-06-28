'use strict';

const expect = require('chai').expect;
const net = require('net');
const server = require('../server.js');
const Client = require('../model/client.js');


describe('Testing server', function () {
  beforeEach(done => {
    server.listen(3000);
    done();
  });
  afterEach(done => {
    server.close();
    done();
  });
  describe('/all', function(){
    it('should send a message to all users', done => {
      let client = net.connect({port: 3000}, function(){
        client.write('/all hello');
        client.on('data', function(data){
          expect(data.toString()).to.include('hello');
        });
        done();
      });
    });
  });
  describe('/dm', function(){
    it('should send a message to specific user', done => {
      let personOne = new Client();
      personOne.nickName = 'Person One';

      let personTwo = new Client();
      personTwo.nickName = 'Person Two';

      let client = net.connect({port: 3000}, function(){
        client.write('/dm Person One hello');
        client.on('data', function(data){
          expect(data.toString()).to.include('Person One hello');
        });
        done();
      });
    });
  });
  describe('/nick', function(){
    it('should change the nickname', done => {
      let client = net.connect({port: 3000}, function(){
        client.write('/nick david');
        client.on('data', function(data){
          expect(data.toString()).to.equal('Nickname has changed to david');
        });
        done();
      });
    });
  });
});
