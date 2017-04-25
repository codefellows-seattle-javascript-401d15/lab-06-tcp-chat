'use strict';

const assert = require('assert');
const app = require('../server.js');
const expect = require('chai').expect;

describe('server.js', function() {
  describe('client', function() {
    it('type of client nickname should return string', function() {
      assert.equal(typeof client.nickName, 'string');
    });
  });
});
