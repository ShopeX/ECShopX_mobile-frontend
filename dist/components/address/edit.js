"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../utils/index.js");

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddressEdit = (_temp2 = _class = function (_BaseComponent) {
  _inherits(AddressEdit, _BaseComponent);

  function AddressEdit() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, AddressEdit);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AddressEdit.__proto__ || Object.getPrototypeOf(AddressEdit)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "multiIndex", "areaList", "listLength", "value", "__fn_onDelete"], _this.bindMultiPickerChange = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var info;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                info = _this.state.info;

                _this.nList.map(function (item, index) {
                  if (index === e.detail.value[0]) {
                    info.province = item.label;
                    item.children.map(function (s_item, sIndex) {
                      if (sIndex === e.detail.value[1]) {
                        info.city = s_item.label;
                        s_item.children.map(function (th_item, thIndex) {
                          if (thIndex === e.detail.value[2]) {
                            info.county = th_item.label;
                          }
                        });
                      }
                    });
                  }
                });
                _this.setState({ info: info });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.bindMultiPickerColumnChange = function (e) {
      var _this$state = _this.state,
          areaList = _this$state.areaList,
          multiIndex = _this$state.multiIndex;

      if (e.detail.column === 0) {
        _this.setState({
          multiIndex: [e.detail.value, 0, 0]
        });
        _this.nList.map(function (item, index) {
          if (index === e.detail.value) {
            var arrCity = [];
            var arrCounty = [];
            item.children.map(function (c_item, c_index) {
              arrCity.push(c_item.label);
              if (c_index === 0) {
                c_item.children.map(function (cny_item) {
                  arrCounty.push(cny_item.label);
                });
              }
            });
            areaList[1] = arrCity;
            areaList[2] = arrCounty;
            _this.setState({ areaList: areaList });
          }
        });
      } else if (e.detail.column === 1) {
        multiIndex[1] = e.detail.value;
        _this.setState({ multiIndex: multiIndex });
        _this.nList[multiIndex[0]].children.map(function (c_item, c_index) {
          if (c_index === e.detail.value) {
            var arrCounty = [];
            c_item.children.map(function (cny_item) {
              arrCounty.push(cny_item.label);
            });
            areaList[2] = arrCounty;
            _this.setState({ areaList: areaList });
          }
        });
      } else {
        multiIndex[2] = e.detail.value;
        _this.setState({ multiIndex: multiIndex });
      }
    }, _this.handleSubmit = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
        var value, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                value = e.detail.value;
                data = _extends({}, _this.state.info, value);


                if (!data.is_def) {
                  data.is_def = '0';
                } else {
                  data.is_def = '1';
                }
                if (_this.state.listLength === 0) {
                  data.is_def = '1';
                }

                if (data.username) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", _index7.default.toast('请输入收件人'));

              case 6:
                if (!(!data.telephone || !/1\d{10}/.test(data.telephone))) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", _index7.default.toast('请输入正确的手机号'));

              case 8:
                if (data.province) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", _index7.default.toast('请选择所在区域'));

              case 10:
                if (data.adrdetail) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt("return", _index7.default.toast('请输入详细地址'));

              case 12:
                console.log(data);
                _this.props.onChange && _this.__triggerPropsFn("onChange", [null].concat([data]));
                _this.props.onClose && _this.__triggerPropsFn("onClose", [null].concat([]));

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.handleChange = function (name, val) {
      var info = _this.state.info;

      info[name] = val;
    }, _this.handleDefChange = function (e) {
      console.log(e.detail.value);
      var info = _extends({}, _this.state.info, {
        is_def: e.detail.value ? 1 : 0
      });

      _this.setState({
        info: info
      });
    }, _this.handleDelete = function () {
      _this.__triggerPropsFn("onDelete", [null].concat([_this.state.info]));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AddressEdit, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AddressEdit.prototype.__proto__ || Object.getPrototypeOf(AddressEdit.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: _extends({}, this.props.value),
        areaList: [],
        multiIndex: [],
        listLength: 0
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {

      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this3 = this;

        var _ref5, list, info, res, nList, arrProvice, arrCity, arrCounty;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _index4.default.member.addressList();

              case 2:
                _ref5 = _context3.sent;
                list = _ref5.list;

                this.setState({
                  listLength: list.length
                });
                info = this.state.info;
                _context3.next = 8;
                return _index4.default.member.areaList();

              case 8:
                res = _context3.sent;
                nList = (0, _index5.pickBy)(res, {
                  label: 'label',
                  children: 'children'
                });

                this.nList = nList;
                arrProvice = [];
                arrCity = [];
                arrCounty = [];

                nList.map(function (item, index) {
                  arrProvice.push(item.label);
                  if (index === 0) {
                    item.children.map(function (c_item, c_index) {
                      arrCity.push(c_item.label);
                      if (c_index === 0) {
                        c_item.children.map(function (cny_item) {
                          arrCounty.push(cny_item.label);
                        });
                      }
                    });
                  }
                });
                info.province = arrProvice[0];
                info.city = arrCity[0];
                info.county = arrCounty[0];
                this.setState({
                  areaList: [arrProvice, arrCity, arrCounty]
                }, function () {
                  _this3.setState({
                    multiIndex: [0, 0, 0],
                    info: info
                  });
                });

              case 19:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetch() {
        return _ref4.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.state.info) {
        this.setState({
          info: _extends({}, nextProps.value)
        });
      }
    }

    // 选定开户地区

  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          areaList = _state.areaList,
          multiIndex = _state.multiIndex;

      if (!info) {
        return null;
      }
      //
      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return AddressEdit;
}(_index.Component), _class.properties = {
  "value": {
    "type": null,
    "value": null
  },
  "onChange": {
    "type": null,
    "value": null
  },
  "__fn_onChange": {
    "type": null,
    "value": null
  },
  "onClose": {
    "type": null,
    "value": null
  },
  "__fn_onClose": {
    "type": null,
    "value": null
  },
  "__fn_onDelete": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleSubmit", "handleChange", "bindMultiPickerChange", "bindMultiPickerColumnChange", "handleDefChange", "handleDelete"], _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = AddressEdit;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(AddressEdit));