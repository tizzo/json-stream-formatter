var es = require('event-stream');

module.exports = function () { 
  return es.through(function (data) {
    var obj
    try {
      // Ignore empty lines.
      if (data) {
        obj = JSON.parse(data.toString())
      }
    } 
    catch (err) {
      // We do not want to emit anything in the event of a failure.
    }
    // Ignore lines that where only whitespace.
    if (obj !== undefined) {
      this.emit('data', obj);
    }
  });
}
