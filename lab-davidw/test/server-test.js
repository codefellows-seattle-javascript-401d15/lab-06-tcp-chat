// 'use strict';
//
// const expect = require('chai').Expect;
// const testServer = require('../server.js');
// const testClient = require('../model/client.js');
// const net = require('net');

// describe('server tests', function() {
//   //hooks
//   before(done => {
//     console.log(this);
//     testServer.listen(3000);
//     this.client = new testClient();
//     done();
//   });
//   after(done => {
//     testServer.close();
//     done();
//   });
//
//   it('should start with an empty pool array', done => {
//     console.log('wtfsa:' + testClient.server.pool);
//     expect(testClient.server.pool).to.be.a('array');
//     done();
//   });
// });
