'use strict';

var util = require('util');
var os = require('os');

var Twig = require('twig');
var through2 = require('through2');

// Attach chalk colors.
var chalkTwig = require('chalk-twig-filters');

module.exports = {};
module.exports.format = function stringStream(format, options) {

  chalkTwig(Twig, options);

  var template = Twig.twig({
    data: format,
  });

  var processor = function(data, enc, cb) {
    if (typeof data === 'object') {
      data = template.render(data);
    }
    cb(null, data + os.EOL);
  };

  return through2.obj(processor);
};

module.exports.prettyPrint = function() {
  var processor = function(data, enc, cb) {
    var options = {
      showHidden: true,
      depth: null,
      colors: true,
    };
    cb(null, util.inspect(data, options) + os.EOL);
  };
  return through2.obj(processor);
};

// Export the twig instance so that it can be extended.
module.exports.Twig = Twig;
