'use strict';

const uuid = require('uuid');

module.exports = function(socket) {
  this.socket = socket;
  this.nickname = uuid.v4();
  this.username = `${Math.random()}`;
};
