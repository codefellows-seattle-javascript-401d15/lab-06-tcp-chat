'use strict';

const expect = require('chai').expect;
const TestClient = require('../model/client.js');

describe('client test', () => {
  before('Create Client Object', () => {
    this.client = new TestClient();
  });
  it('should return an object', done => {
    expect(this.client).to.be.an.instanceof(Object);
    done();
  });
  it('should contain socket', done => {
    this.client.socket = 3000;
    expect(this.client.socket).to.equal(3000);
    done();
  });
  it('should contain nickName as a string', done => {
    expect(this.client.nickName).to.be.a('string');
    done();
  });
  it('should contain userName as a string', done => {
    expect(this.client.userName).to.be.a('string');
    done();
  });
});
