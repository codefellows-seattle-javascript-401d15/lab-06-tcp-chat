'use strict';

const Client = require('../model/chat');
const expect = require('chai').expect;
const net = require('net');
const server = require('../server.js');



describe('Server run check', function(){
  before('Listening on PORT 3000', done =>{
    server.listen(3000);
    console.log('running');
    done();
  });


  after('Close Server on PORT 3000', done =>{
    server.close();
    done();
  });

  describe('Chat functionality', function(){

    describe('/all should send a message to all', done =>{
      let client = net.connect({port: 3000}, function(){
        console.log(client);
        client.write('/all howdy');
        client.on('data', data => {
          expect(data.toString()).to.include('howdy');
        });
        done();
      });
    });

  });
});
