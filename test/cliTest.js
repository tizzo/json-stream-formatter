var should = require('should');
var through2 = require('through2');
var split2 = require('split2');
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

function writeArray(done) {
  var history = [];
  var recorder = function(data, enc, cb) {
    history.push(data.toString());
    cb(null, data);
  };
  var reporter = function() {
    done(null, history);
  };
  return through2(recorder, reporter);
}

describe('cli', function() {
  it('should encode a stream with the --format option', function(done) {
    var bin = path.join(__dirname, '..', 'bin', 'json-stream-format');
    var args = [
      '--format', '{{name|capitalize}}',
    ];
    var child = spawn(bin, args);
    fs.createReadStream(path.join(__dirname, 'fixtures', 'example2.log'))
      .pipe(child.stdin);
    var history = [];
    child.stdout
      .pipe(split2())
      .pipe(writeArray(function(error, data) {
        should.exist(data);
        data[0].should.equal('First');
        data[12].should.equal('Last');
        data.length.should.equal(14);
        done();
      }));
  });
  it('should encode a stream with the format passed as the arguments', function(done) {
    var bin = path.join(__dirname, '..', 'bin', 'json-stream-format');
    var args = [
      '{{name|capitalize}}',
    ];
    var child = spawn(bin, args);
    fs.createReadStream(path.join(__dirname, 'fixtures', 'example2.log'))
      .pipe(child.stdin);
    child.stdout
      .pipe(split2())
      .pipe(writeArray(function(error, data) {
        data = data.map(function(item) { return item.toString('utf8')});
        data[0].should.equal('First');
        data[12].should.equal('Last');
        data.length.should.equal(14);
        done();
      }));
  });
  it('should encode a stream with the format passed as multiple arguments', function(done) {
    var bin = path.join(__dirname, '..', 'bin', 'json-stream-format');
    var args = [
      '{{',
      'name|capitalize',
      '}}',
      '{{',
      'hostname',
      '}}',
    ];
    var child = spawn(bin, args);
    fs.createReadStream(path.join(__dirname, 'fixtures', 'example2.log'))
      .pipe(child.stdin);
    child.stdout
      .pipe(split2())
      .pipe(writeArray(function(error, data) {
        data = data.map(function(item) { return item.toString('utf8')});
        data[0].should.equal('First example.com');
        data[12].should.equal('Last example.com');
        data.length.should.equal(14);
        done();
      }));
  });
  it('should include invalid json with the `--include-invalid` option', function(done) {
    var bin = path.join(__dirname, '..', 'bin', 'json-stream-format');
    var args = [
      '--format', '{{name|capitalize}}',
      '--include-invalid',
    ];
    var child = spawn(bin, args);
    fs.createReadStream(path.join(__dirname, 'fixtures', 'example2.log'))
      .pipe(child.stdin);
    var history = [];
    child.stdout
      .pipe(split2())
      .pipe(writeArray(function(error, data) {
        should.exist(data);
        data[0].should.equal('# levels');
        data[1].should.equal('First');
        data.should.containEql('# bogus');
        data.should.containEql('Last');
        data.length.should.not.equal(14);
        done();
      }));
  });
});
