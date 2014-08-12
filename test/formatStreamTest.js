var should = require('should');
var es = require('event-stream');

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
          data[0].should.equal("Foo: some value, Bar: some other value\n\r");
          data[1].should.equal("Foo: Another thing, Bar: Some more still\n\r");
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
          data[0].should.equal('{ foo: \u001b[32m\'some value\'\u001b[39m,\n  bar: \u001b[32m\'some other value\'\u001b[39m }\n');
          data[1].should.equal('{ foo: \u001b[32m\'Another thing\'\u001b[39m,\n  bar: \u001b[32m\'Some more still\'\u001b[39m }\n');
        }));
    });
  });
});
