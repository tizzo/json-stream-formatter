var should = require('should');
var es = require('event-stream');
var util = require('util');

var esf = require('..');

describe('json format stream', function() {
  describe('format stream', function() {
    it('should take a stream and transform it based on the pattern', function() {
      var events = [
        { foo: 'some value', bar: 'some other value' },
        { foo: 'Another thing', bar: 'Some more still' },
      ];
      var stream = es.readArray(events)
        .pipe(esf.format('Foo: {{ foo }}, Bar: {{ bar }}'))
        .pipe(es.writeArray(function(error, data) {
          data[0].should.equal("Foo: some value, Bar: some other value\n");
          data[1].should.equal("Foo: Another thing, Bar: Some more still\n");
        }));
    });
  });
  describe('pretty stream', function() {
    it('should pretty print json objects', function() {
      var events = [
        { foo: 'some value', bar: 'some other value' },
        { foo: 'Another thing', bar: 'Some more still' },
      ];
      var stream = es.readArray(events)
        .pipe(esf.prettyPrint())
        .pipe(es.writeArray(function(error, data) {
        var options = {
            showHidden: true,
            depth: null,
            colors: true,
          };
          data[0].should.equal(util.inspect(events[0], options) + '\n');
          data[1].should.equal(util.inspect(events[1], options) + '\n');
        }));
    });
  });
});
