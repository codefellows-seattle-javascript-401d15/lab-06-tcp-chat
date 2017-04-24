'use strict';

let uuid = require('node-uuid');

module.exports = function(socket) {
  this.socket = socket;
  this.nickName = `guest #${Math.floor(Math.random()*10000)}`;
  this.userName = uuid.v4();
};
