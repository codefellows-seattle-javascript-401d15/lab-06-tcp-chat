'use strict';

const expect = require('chai').Expect;
const testClient = require('../model/client.js');

describe('client test', () => {
  before('Create Client object', () =>{
    this.client = new testClient();
  });
  it('should return an object', done => {
    expect(this.client).to.be.an.instanceof(Object);
    done();
  });
  it('should contain a username as a string', done => {
    expect(this.client.userName).to.be.a('string');
    done();
  });
  it('shoud contain a username as a string', done => {
    expect(this.client.nickName).to.be.a('string');
    done();
  });
  it('should contain a socket', done => {
    this.client.socket = 8080;
    expect(this.client.socket).to.equal(3000);
    done();
  });
});
