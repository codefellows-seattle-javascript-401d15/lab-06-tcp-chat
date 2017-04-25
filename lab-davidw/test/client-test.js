'use strict';

const expect = require('chai').expect;
const testClient = require('../model/client.js');

describe('client test', () => {
  before('Create Client Object', () => {
    this.client = new testClient();
    console.log(this.client);
  });
  it('should return an object', done => {
    expect(this.client).to.be.an.instanceof(Object);
    done();
  });
  it('should contain socket', done => {
    this.client.socket = 3000; 
    console.log(this.client.socket);
    expect(this.client.socket).to.equal(3000);
    done();
  });
  it('should contain nickName as a string', done => {
    console.log(this.client.nickName);
    expect(this.client.nickName).to.be.a('string');
    done();
  });
  it('should contain userName as a string', done => {
    console.log(this.client.userName);
    expect(this.client.userName).to.be.a('string');
    done();
  });
});
