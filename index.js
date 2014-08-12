'use strict';

var Twig = require('twig');
var through = require('through');

// Attach chalk colors.
var chalkTwig = require('chalk-twig-filter');

module.exports = function stringStream(format, options) {

  chalkTwig(Twig);

  var template = Twig.twig({
    data: format,
  });

  var processor = function(data) {
    this.queue(template.render(data));
  };

  return through(processor);
};

// Export the twig instance so that it can be extended.
module.exports.Twig = Twig;
