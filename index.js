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
  raw
    .split(';')
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
