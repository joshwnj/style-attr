/*

style-attr
====

Very simple parsing and stringifying of style attributes.

`parse`
----

Convert a style attribute string to an object.

- input: string (eg. anything you might see in a style attribute)
- return: object

*/
function parse (raw) {
  var trim = function (s) { return s.trim(); };
  var obj = {};

  getKeyValueChunks(raw)
    .map(trim)
    .filter(Boolean)
    .forEach(function (item) {
      // split with `.indexOf` rather than `.split` because the value may also contain colons.
      var pos = item.indexOf(':');
      var key = item.substr(0, pos).trim();
      var val = item.substr(pos + 1).trim();

      obj[key] = val;
    });

  return obj;
}

/*

`getKeyValueChunks`
----

Split a string into chunks matching `<key>: <value>`

- input: string
- return: Array<string>

*/
function getKeyValueChunks (raw) {
  var chunks = [];
  var offset = 0;
  var sep = ';';
  var hasUnclosedUrl = /url\([^\)]+$/;
  var chunk = '';
  var nextSplit;
  while (offset < raw.length) {
    nextSplit = raw.indexOf(sep, offset);
    if (nextSplit === -1) { nextSplit = raw.length; }

    chunk += raw.substring(offset, nextSplit);

    // data URIs can contain semicolons, so make sure we get the whole thing
    if (hasUnclosedUrl.test(chunk)) {
      chunk += ';';
      offset = nextSplit + 1;
      continue;
    }

    chunks.push(chunk);
    chunk = '';
    offset = nextSplit + 1;
  }

  return chunks;
}

/*

`stringify`
----

Convert an object into an attribute string

- input: object
- return: string

*/
function stringify (obj) {
  return Object.keys(obj)
    .map(function (key) {
      return key + ':' + obj[key];
    })
    .join(';');
}

/*

`normalize`
----

Normalize an attribute string (eg. collapse duplicates)

- input: string
- return: string

*/
function normalize (str) {
  return stringify(parse(str));
}

module.exports.parse = parse;
module.exports.stringify = stringify;
module.exports.normalize = normalize;
