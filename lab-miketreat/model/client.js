'use strict';

const uuidV4 = require('node-uuid');

module.exports = function(socket){
  this.socket = socket;
  this.nickname = `anon${Math.floor(Math.random()*99999)}`;
  this.userName = uuidV4();
};
