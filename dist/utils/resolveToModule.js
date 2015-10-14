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

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = resolveToModule;

var _match = require('./match');

var _match2 = _interopRequireDefault(_match);

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

var _resolveToValue = require('./resolveToValue');

var _resolveToValue2 = _interopRequireDefault(_resolveToValue);

var types = _recast2['default'].types.namedTypes;

/**
 * Given a path (e.g. call expression, member expression or identifier),
 * this function tries to find the name of module from which the "root value"
 * was imported.
 */

function resolveToModule(_x) {
  var _again = true;

  _function: while (_again) {
    var path = _x;
    node = valuePath = undefined;
    _again = false;

    var node = path.node;
    switch (node.type) {
      case types.VariableDeclarator.name:
        if (node.init) {
          _x = path.get('init');
          _again = true;
          continue _function;
        }
        break;
      case types.CallExpression.name:
        if ((0, _match2['default'])(node.callee, { type: types.Identifier.name, name: 'require' })) {
          return node.arguments[0].value;
        }
        _x = path.get('callee');
        _again = true;
        continue _function;

      case types.Identifier.name:
        var valuePath = (0, _resolveToValue2['default'])(path);
        if (valuePath !== path) {
          _x = valuePath;
          _again = true;
          continue _function;
        }
        break;
      case types.ImportDeclaration.name:
        return node.source.value;
      case types.MemberExpression.name:
        while (path && types.MemberExpression.check(path.node)) {
          path = path.get('object');
        }
        if (path) {
          _x = path;
          _again = true;
          continue _function;
        }
    }
  }
}

module.exports = exports['default'];