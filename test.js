/*

Tests
====

Can be run with `npm run test`

*/
var tape = require('tape');
var style = require('./');

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

  var rawWithNumbers = ';color:red; font-size: 26px;  color :  blue     ;opacity: 0.35';
  var obj2 = style.parse(rawWithNumbers, { preserveNumbers: true });

  t.equal(
    obj2.opacity,
    0.35,
    'Parsing with numbers preserved does not convert numbers to strings');

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

  var str2 = style.stringify(obj2);
  t.equal(
    str2,
    'color:blue;font-size:26px;opacity:0.35',
    'Stringified version with numbers contains all object info');

  t.deepEqual(
    style.parse(str2, { preserveNumbers: true }),
    obj2,
    'Subsequent parse/stringify actions with numbers are idempotent');

  //> tests for [[style-attr][`normalize`]]
  t.equal(
    style.normalize(raw),
    style.stringify(obj),
    'Normalizing a string gives the same result as converting and back again');

  t.equal(
    style.normalize(raw),
    style.normalize(style.normalize(raw)),
    'Normalizing is idempotent');

  t.equal(
    style.normalize(rawWithNumbers, { preserveNumbers: true }),
    style.stringify(obj2),
    'Normalizing a string with numbers gives the same result as converting and back again');

  t.equal(
    style.normalize(rawWithNumbers),
    style.normalize(style.normalize(rawWithNumbers)),
    'Normalizing with numbers is idempotent');

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

tape('Data URIs', function (t) {
  var url = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC)';
  var raw = 'background: ' + url;

  var obj = style.parse(raw);
  t.equal(
    obj.background,
    url,
    'URL values are parsed correctly');

  t.end();
});
