'use strict';

const uuidV4 = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  this.nickname = `${Math.random()}`;
  this.userName = uuidV4();
};
