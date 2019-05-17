'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createReducer;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require('../npm/redux-create-reducer/index.js');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import dotProp from 'dot-prop-immutable'

var initState = {
  favs: {}
};

var member = (0, _index.createReducer)(initState, (_createReducer = {}, _defineProperty(_createReducer, 'member/favs', function memberFavs(state, action) {
  var favsList = action.payload;
  var favs = {};
  favsList.forEach(function (_ref) {
    var item_id = _ref.item_id,
        fav_id = _ref.fav_id;

    favs[item_id] = {
      item_id: item_id,
      fav_id: fav_id
    };
  });

  return _extends({}, state, {
    favs: favs
  });
}), _defineProperty(_createReducer, 'member/addFav', function memberAddFav(state, action) {
  var item_id = action.payload.item_id;

  var favs = _extends({}, state.favs, {
    item_id: item_id
  });

  return _extends({}, state, {
    favs: favs
  });
}), _defineProperty(_createReducer, 'member/delFav', function memberDelFav(state, action) {
  var item_id = action.payload.item_id;

  var favs = _extends({}, state.favs);
  delete favs[item_id];

  return _extends({}, state, {
    favs: favs
  });
}), _createReducer));

exports.default = member;