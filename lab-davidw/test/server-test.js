'use strict';

const expect = require('chai').Expect;
const testServer = require('../server.js');

describe('server tests', () => {
  before('Start a server to test against', () => {
    this.server = testServer();
    console.log(this.server.pool);
  });
  it('should start with an empty pool array', done => {
    expect(this.server.pool).to.be.an.instanceof(Array);
    done();
  });
});
