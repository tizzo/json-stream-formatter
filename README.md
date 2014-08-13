# JSON Event Stream Formatter

## Usage

### CLI usage

By default json-stream-format pretty prints a json stream.  If you want to use a more specific format you can use the
`--format` (`-f`) parameter and specify the format.  Place object keys to include inside double curly `{{something}}`
brackets.

#### Example

```` bash
cat test/fixtures/example.log | json-stream-format -f '{{time|date("h:m:s")|blue}}: {{msg|green}}'
````

### Node.js usage

#### Formatting

```` javascript
var jsf = require('json-stream-formatter');
var es = require('event-stream');
process.stdin
  .pipe(es.split())
  .pipe(es.parse())
  .pipe(jsf.format('{{time|date("d/m/y h:m:s")|blue}}: {{msg}}'))
  .pipe(process.stdout);
````

#### Pretty printing

```` javascript
var jsf = require('json-stream-formatter');
var es = require('event-stream');
process.stdin
  .pipe(es.split())
  .pipe(es.parse())
  .pipe(jsf.prettyPrint())
  .pipe(process.stdout);
````

## Format sytnax

The formatter utilizes [twig.js](https://www.npmjs.org/package/twig) for foratting
the json event messages.  Avilable filters can be found in the twig.js
[implementation notes](https://github.com/justjohn/twig.js/wiki/Implementation-Notes).

## Installation

```` bash
sudo npm install -g json-stream-formatter
````
