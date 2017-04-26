'use strict';

const net = require('net');
const client = net.connect({port: 3000});
const serverFile = require('../server.js');
const EE = require('events').EventEmitter;
const ee = new EE();

describe('server.js', function(){
  describe('#server.on connection', function(){
    it('pushes new clients onto pool array', function(){
      serverFile.server.listen(serverFile.PORT, console.log(`server listening on PORT: ${serverFile.PORT}`));
      client.on()
    });

  //   it('removes clients on close, from pool array', function(){
  //
  //   });
  // });
  //
  // describe('#ee.on nickName', function(){
  //   it('changes nickName property in the client obj in pool', function(){
  //
  //   });
  });
});
