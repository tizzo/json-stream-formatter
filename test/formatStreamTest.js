var should = require('should');
var through2 = require('through2');
var util = require('util');

var esf = require('..');

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

describe('json format stream', function() {
  describe('format stream', function() {
    it('should take a stream and transform it based on the pattern', function() {
      var events = [
        { foo: 'some value', bar: 'some other value' },
        { foo: 'Another thing', bar: 'Some more still' },
      ];
      var stream = through2.obj();
      stream
        .pipe(esf.format('Foo: {{ foo }}, Bar: {{ bar }}'))
        .pipe(writeArray(function(error, data) {
          data[0].should.equal("Foo: some value, Bar: some other value\n");
          data[1].should.equal("Foo: Another thing, Bar: Some more still\n");
        }));
      events.map(function(event) { stream.write(event); });
    });
  });
  describe('pretty stream', function() {
    it('should pretty print json objects', function() {
      var events = [
        { foo: 'some value', bar: 'some other value' },
        { foo: 'Another thing', bar: 'Some more still' },
      ];
      var stream = through2.obj();
      stream
        .pipe(esf.prettyPrint())
        .pipe(writeArray(function(error, data) {
        var options = {
            showHidden: true,
            depth: null,
            colors: true,
          };
          data[0].should.equal(util.inspect(events[0], options) + '\n');
          data[1].should.equal(util.inspect(events[1], options) + '\n');
        }));
      events.map(function(event) { stream.write(event); });
    });
  });
});
