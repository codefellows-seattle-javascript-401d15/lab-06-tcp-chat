'use strict';

const expect = require('chai').expect;
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('../model/client');

describe('command.startsWith @nick', function() {
  describe('when the event emitter fires for @nick command', function() {

    it('should change the client name to the new nickname', function(done){
      //create new client
      let testUser = new Client(123);
      console.log('original nickName:', testUser);
      ee.on('@nick', (testUser, string) => {
        testUser.nickName = string;
      });

      ee.on('data', function(data) {
        let command = data.toString().split(' ').shift().trim();
        if(command.startsWith('@nick')) {
          ee.emit(command, testUser, data.toString().split(' ').slice(1).shift().trim());
          return;
        }
      });

      ee.emit('@nick', testUser, '@nick shelly'.toString().split(' ').slice(1).shift().trim());
      console.log('new nickName:', testUser);

      expect(testUser).to.have.property('nickName','shelly');
      done();

    });
  });
});
