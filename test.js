/*

Tests
====

Can be run with `npm run test`

*/
var tape = require('tape');
var style = require('./index.js');

tape('Basic usage', function (t) {
  //> tests for [[style-attr][`parse`]]
  var raw = ';color:red; font-size: 26px;  color :  blue     ;';
  var obj = style.parse(raw);

  t.equal(
    Object.keys(obj).length,
    2,
    'Duplicate rules are collapsed, empty rules are ignored');

  t.ok(
    obj.hasOwnProperty('color'),
    'Whitespace is trimmed from keys');

  t.equal(
    obj.color,
    'blue',
    'Whitespace is trimmed from values');

  //> tests for [[style-attr][`stringify`]]
  var str = style.stringify(obj);
  t.equal(
    str,
    'color:blue;font-size:26px',
    'Stringified version contains all object info');

  t.deepEqual(
    style.parse(str),
    obj,
    'Subsequent parse/stringify actions are idempotent');

  //> tests for [[style-attr][`normalize`]]
  t.equal(
    style.normalize(raw),
    style.stringify(obj),
    'Normalizing a string gives the same result as converting and back again');

  t.equal(
    style.normalize(raw),
    style.normalize(style.normalize(raw)),
    'Normalizing is idempotent');

  t.end();
});

tape('Background images', function (t) {
  var url = 'url(http://38.media.tumblr.com/tumblr_l5y2n9EIiN1qci224o1_250.gif)';
  var raw = 'background: ' + url;

  var obj = style.parse(raw);
  t.equal(
    obj.background,
    url,
    'URL values are parsed correctly');

  t.end();
});
