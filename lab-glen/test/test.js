'use strict';

const Client = require('../model/client');
const expect = require('chai').expect;

describe('Nickname Test', function() {
  let testClient = {};
  let testObject = new Client();
  before(function(done) {
    testClient.nickName = testObject.nickName;
    console.log(testClient.nickName);
    done();
  });
  it('Should change the users nickname', function () {
    expect(testObject.nickName).to.be.not.equal(testObject.nickName);
  });

});

describe('Test new Client', function() {
  let testObject = new Client();
  it('A new client object should be returned', function(done) {
    expect(testObject).to.be.instanceof(Object);
    done();
  });
});
