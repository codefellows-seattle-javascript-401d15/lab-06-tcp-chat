'use strict';

const expect = require('chai').expect;
const serverJS = require('server.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

describe('server.js', function() {
  before(function() {
    server.listen('3000', function(
      console.log();
    ))
  })
})