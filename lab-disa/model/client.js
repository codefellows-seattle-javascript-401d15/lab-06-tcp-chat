'use strict';

const uuid = require('node-uuid');

module.exports = function(socket) {
  this.socket = socket;
  this.userName = uuid.v4();
  this.nickName = `${Math.random()}`;

};
