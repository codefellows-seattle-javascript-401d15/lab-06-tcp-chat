'use strict';

const uuidV4 = require('uuid/v4');

module.exports = function(socket) {
  this.socket = socket;
  this.userName = uuidV4();
  this.nickName = `guest-${Math.floor(Math.random()*1000 + 1)}`;
};
