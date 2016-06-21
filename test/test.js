'use strict';

var expect = require('chai').expect;

var index = require('../index');

describe('#serial interface unit tests', () => {

    beforeEach(done => {
        index.port.flush(err => {
          if (err) {
            console.log(err);
          }
          done();
        });
    });

    it('prompts slave to echo one byte back to host', done => {
        const buffer = Buffer.from([0x01]);
        const expected_result = '028201'; // Length (1+ 1), Echo OpCode, Data

        index.port.once('data', data => {
          expect(data.toString('hex')).to.equal(expected_result);
          done();
        });

        index.echo(buffer);
    });

    it('prompts slave to echo two bytes back to host', done => {
        const buffer = Buffer.from([0x01, 0x02]);
        const expected_result = '03820102'; // Length (2 + 1?), Echo OpCode, Data

        index.port.once('data', data => {
          expect(data.toString('hex')).to.equal(expected_result);
          done();
        });

        index.echo(buffer);
    });

    it('prompts slave to echo max bytes back to host', done => {
        const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05, 0x01, 0x02, 0x03, 0x04]);
        const expected_result = '1982010203040501020304050102030405010203040501020304';

        index.port.once('data', data => {
          expect(data.toString('hex')).to.equal(expected_result);
          done();
        });

        index.echo(buffer);
    });

    /*it('prompts slave to echo too many bytes back to host', done => {
        const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05]);
        const expected_result = '1a8201020304050102030405010203040501020304050102030405';

        index.port.once('data', data => {
          expect(data.toString('hex')).to.equal(expected_result);
          done();
        });

      index.echo(buffer);
    });*/

    it('prompts the slave to return its build version', done => {
      const expected_result = '000803';

      let callback = (err, res) => {
        if (err) {
          console.log(err);
        }
        expect(res).to.equal(expected_result);
        done();
      }

      index.buildVersionGet(callback);
    });

    it('prompts the slave to perform a radio reset', done => {
      let callback = err => {
        if (err) {
          console.log(err);
          expect(false).to.equal(true);
        }
        done();
      }

      index.radioReset(callback);
    });
});
