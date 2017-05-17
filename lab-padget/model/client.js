'use strict';

const uuidV4 = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  // Give clients a unique username id.
  this.userName = uuidV4();

  // Value no lower than min and less than max.
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  // Give clients a unique 'nickname'. e.g. guest-43.
  this.nickName = `guest-${getRandomInt(1, 101)}`;
};
