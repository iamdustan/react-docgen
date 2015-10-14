/*
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 *
 */

/*eslint no-loop-func: 0, no-use-before-define: 0*/

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _resolveToValue = require('./resolveToValue');

var _resolveToValue2 = _interopRequireDefault(_resolveToValue);

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

var types = _recast2['default'].types.namedTypes;

/**
 * Splits a MemberExpression or CallExpression into parts.
 * E.g. foo.bar.baz becomes ['foo', 'bar', 'baz']
 */
function toArray(path) {
  var parts = [path];
  var result = [];

  while (parts.length > 0) {
    path = parts.shift();
    var node = path.node;
    if (types.CallExpression.check(node)) {
      parts.push(path.get('callee'));
      continue;
    } else if (types.MemberExpression.check(node)) {
      parts.push(path.get('object'));
      if (node.computed) {
        var resolvedPath = (0, _resolveToValue2['default'])(path.get('property'));
        if (resolvedPath !== undefined) {
          result = result.concat(toArray(resolvedPath));
        } else {
          result.push('<computed>');
        }
      } else {
        result.push(node.property.name);
      }
      continue;
    } else if (types.Identifier.check(node)) {
      result.push(node.name);
      continue;
    } else if (types.Literal.check(node)) {
      result.push(node.raw);
      continue;
    } else if (types.ThisExpression.check(node)) {
      result.push('this');
      continue;
    } else if (types.ObjectExpression.check(node)) {
      var properties = path.get('properties').map(function (property) {
        return toString(property.get('key')) + ': ' + toString(property.get('value'));
      });
      result.push('{' + properties.join(', ') + '}');
      continue;
    } else if (types.ArrayExpression.check(node)) {
      result.push('[' + path.get('elements').map(toString).join(', ') + ']');
      continue;
    }
  }

  return result.reverse();
}

/**
 * Creates a string representation of a member expression.
 */
function toString(path) {
  return toArray(path).join('.');
}

exports.String = toString;
exports.Array = toArray;