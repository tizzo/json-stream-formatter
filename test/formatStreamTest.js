var should = require('should');
var es = require('event-stream');

var esf = require('..');

describe('through stream', function() {
  it('should take a stream and transform it based on the pattern', function() {
    var events = [
      { foo: 'some value', bar: 'some other value' },
      { foo: 'Another thing', bar: 'Some more still' },
    ];
    var stream = es.readArray(events)
      .pipe(esf('Foo: {{ foo }}, Bar: {{ bar }}'))
      .pipe(es.writeArray(function(error, data) {
        data[0].should.equal('Foo: some value, Bar: some other value');
        data[1].should.equal('Foo: Another thing, Bar: Some more still');
      }));
  });
});
