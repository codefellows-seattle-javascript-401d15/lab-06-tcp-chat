'use strict';

// npm run test
console.log('Evaluating server.js');

const expect = require('chai').expect;
console.log(expect);
// const assert = require('assert');
// const reqContext = require('../lib/server.js');

// Test \nick actually changes a clients nickname
describe('fs module', function() {
  describe('#ee.on', function() {
    it('Should return a string with ', done => {
      console.log(done);
      // fs.readFile(`${__dirname}/../data/one.txt`, function(err, data) {
      //   expect(data.toString()).to.be.a('string');
      //   done();
      // });
    });
    // it('should return a string for plant name', function() {
    //   assert.equal(newPlant.name, 'Tomato');
    // });
    // it('should return a string with planting depth', function() {
    //   assert.equal(typeof newPlant.depth, 'string');
    // });
  });
});

// Allow a user change their nickname.
// ee.on('/nick', (client, string) => {
// pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`))