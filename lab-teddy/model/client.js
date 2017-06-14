'use strict';

const uuidV4 = require('node-uuid');

module.exports = function(socket){
  this.socket = socket;
  this.userName = `${Math.random(0)}`;
  this.nickName = uuidV4();
};
