'use strict';

const uuidV4 = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  this.nickname = `Guest-${Math.floor(Math.random()*100)}`;
  this.userName = uuidV4();
};
