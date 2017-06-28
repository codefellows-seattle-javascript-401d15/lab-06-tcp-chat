'use strict';

const uuidV4 = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  this.nickName = uuidV4();
  this.userName = `${Math.random(0)}`;
};
