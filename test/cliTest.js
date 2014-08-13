var should = require('should');
var es = require('event-stream');
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

describe('cli', function() {
  it('should encode a stream', function(done) {
    var bin = path.join(__dirname, '..', 'bin', 'json-stream-format');
    var args = [
      '--format', '{{name|capitalize}}',
    ];
    var child = spawn(bin, args);
    fs.createReadStream(path.join(__dirname, 'fixtures', 'example2.log'))
      .pipe(child.stdin);
    child.stdout
      .pipe(es.split('\n\r'))
      .pipe(es.writeArray(function(error, data) {
        data = data.map(function(item) { return item.toString('utf8')});
        data[0].should.equal('First');
        data[12].should.equal('Last');
        data.length.should.equal(15);
        done();
      }));
  });
});
