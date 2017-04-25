'use strict';

const uuidV4 = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  this.nickName = `${Math.random()}`; // Clients should have a unique 'nickname'. e.g. guest-43.
  this.userName = uuidV4(); // Clients should have a unique id.
};
