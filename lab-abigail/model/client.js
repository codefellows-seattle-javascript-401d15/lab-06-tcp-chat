'use strict';

const uuid = require('node-uuid');

module.exports = function(socket) {
  this.socket = socket;
  this.nickName = `Guest-${(Math.floor(Math.random() * (99-1) + 1))}`;
  this.userName =  uuid.v4();
};
