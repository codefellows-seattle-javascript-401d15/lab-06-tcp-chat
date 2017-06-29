'use strict';

const expect = require('chai').expect;
const net = require('net');
const server = net.createServer();

describe('server.js', function() {
  before(done => {
    server.listen(3000);
    done();
  });
  
  after(done => {
    server.close();
    done();
  });
    
  describe('on user\'s connection', function() {
    it('should send a message to everyone', function(done) {
      let client = net.connect({port: 3000}, () => {
        client.once('data', data => {
            expect(data.toString()).to.include('connected');
        });
        done();
      });
    });
  });
  
  describe('/nick', done => {
    it('should change your nickname', done => {
    //   let client = new Client();
    //   client.nickName = nick;
      let client = net.connect({port: 3000}, () => {
        client.write('/nick newNick');
        client.on('data', () => {
          expect(client.nickName).to.equal('newNick');
        });
        done();
      });
    }); 
  });
})