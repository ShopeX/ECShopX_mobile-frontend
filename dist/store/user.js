"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require("../npm/redux-create-reducer/index.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initState = {
  land_params: null
};

var user = (0, _index.createReducer)(initState, _defineProperty({}, 'user/landing', function userLanding(state, action) {
  var land_params = action.payload;

  return _extends({}, state, {
    land_params: land_params
  });
}));

exports.default = user;