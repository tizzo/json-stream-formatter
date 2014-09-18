'use strict';

var util = require('util');

var Twig = require('twig');
var through = require('through');

// Attach chalk colors.
var chalkTwig = require('chalk-twig-filters');

module.exports = {};
module.exports.format = function stringStream(format, options) {

  chalkTwig(Twig, options);

  var template = Twig.twig({
    data: format,
  });

  var processor = function(data) {
    this.queue(template.render(data) + "\n");
  };

  return through(processor);
};

module.exports.prettyPrint = function() {
  var processor = function(data) {
    var options = {
      showHidden: true,
      depth: null,
      colors: true,
    };
    this.queue(util.inspect(data, options) + "\n");
  };
  return through(processor);
};

// Export the twig instance so that it can be extended.
module.exports.Twig = Twig;
