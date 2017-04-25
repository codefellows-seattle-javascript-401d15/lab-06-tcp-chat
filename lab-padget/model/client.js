'use strict';

const uuidV4 = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  this.nickName = `${Math.random()}`; // Give clients a unique 'nickname'. e.g. guest-43.
  this.userName = uuidV4(); // Give clients a unique username id.
};
