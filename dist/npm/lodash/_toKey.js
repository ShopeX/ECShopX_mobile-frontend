var isSymbol = require("./isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = Infinity;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -Infinity ? '-0' : result;
}

module.exports = toKey;