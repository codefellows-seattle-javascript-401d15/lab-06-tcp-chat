'use strict';

const uuid = require('node-uuid');

module.exports = function(socket){
  this.socket = socket;
  this.nickname = `guest:${Math.random()}`;
  this.userName = uuid.v4();
};
