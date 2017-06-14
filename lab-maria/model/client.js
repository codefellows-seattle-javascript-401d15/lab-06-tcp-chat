'use strict';
const uuidV4 = require('uuid/v4');

module.exports = function(socket) {
  this.socket = socket;
  this.nickName = `guest-${Math.floor(Math.random() * (500 - 1 + 1)) + 1}`;
  this.userName = uuidV4();
};
