'use strict';
const server = require('../server.js');
const expect = require('chai').expect;
const net = require('net');


describe('server', ()=>{
  before(done => {
    server.listen(3000);
    done();
  });

  after(done => {
    server.close();
    done();

  });

  // describe('Name Change', () => {
  //   it('should change the username of the current user!', done => {
  //     let updatedNickName = 'Mike';
  //     let client = net.connect({port: 3000}, ()=> {
  //       client.write(`/nick ${updatedNickName}`);
  //       client.on('data', data =>{
  //         console.log(data.toString().split(' ').slice(1,6));
  //
  //         expect(data.toString()).to.equal('has changed their name to Misdke');
  //         done();
  //         client.end();
  //       });
  //     });
  //   });
  // });


  describe('On connection', () => {
    it('should be WELCOME!', done => {
      let client = net.connect({port: 3000}, ()=> {
        client.once('data', data =>{
          expect(data.toString().split(' ').slice(1,3).join(' ')).to.equal('has connected!\n\n\nWELCOME!');
          done();
        });
        client.end();
      });
    });
  });


// end of top describe.
});
