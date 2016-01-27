'use strict';
var through2 = require('through2');

/**
 * Parse JSON
 *
 * @param {Object} options - An object with option configurations.
 * @param {Boolean} [options.passthrough=false] - Whether to passthrough any lines that failed to parse.
 */
module.exports = function(options) {
  options = options || {};
  var passthrough = options.passthrough || false;
  return through2.obj(function(data, enc, cb) {
    data = data.toString('utf8');
    var self = this;
    try {
      // Ignore empty lines.
      if (data) {
        data = JSON.parse(data.toString());
        self.push(data);
      }
    }
    catch (err) {
      if (options.passthrough) {
        self.push(data);
      }
    }
    cb();
  });
}
