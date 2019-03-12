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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AddressEdit.__proto__ || Object.getPrototypeOf(AddressEdit)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "info", "multiIndex", "areaList", "list", "value", "__fn_onDelete"], _this.bindMultiPickerChange = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var _this$state, list, info;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('picker发送选择改变，携带值为', e.detail.value);
                _this$state = _this.state, list = _this$state.list, info = _this$state.info;

                list.map(function (item, index) {
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
                _this.setState({
                  info: info
                });

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.bindMultiPickerColumnChange = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
        var _this$state2, list, areaList, multiIndex, indexSarr, th_arr, indexTharr;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$state2 = _this.state, list = _this$state2.list, areaList = _this$state2.areaList, multiIndex = _this$state2.multiIndex;

                console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
                if (e.detail.column === 0) {
                  _this.setState({
                    multiIndex: [e.detail.value, 0, 0]
                  });
                  list.map(function (item) {
                    if (item.label === areaList[0][e.detail.value]) {
                      var s_arr = [];
                      var th_arr = [];
                      item.children.map(function (s_item, s_index) {
                        s_arr.push(s_item.label);
                        if (s_index === 0) {
                          s_item.children.map(function (th_item) {
                            th_arr.push(th_item.label);
                          });
                        }
                      });
                      areaList[1] = s_arr;
                      areaList[2] = th_arr;
                      _this.setState({ areaList: areaList });
                    }
                  });
                } else if (e.detail.column === 1) {
                  indexSarr = multiIndex;

                  indexSarr[1] = e.detail.value;
                  _this.setState({
                    multiIndex: indexSarr
                  });
                  console.log(multiIndex, list[multiIndex[0]]);
                  th_arr = [];

                  list[multiIndex[0]].children.map(function (item) {
                    if (item.label === areaList[1][e.detail.value]) {
                      item.children.map(function (th_item) {
                        th_arr.push(th_item.label);
                      });
                    }
                  });
                  areaList[2] = th_arr;
                  _this.setState({ areaList: areaList });
                } else {
                  indexTharr = multiIndex;

                  indexTharr[2] = e.detail.value;
                  _this.setState({
                    multiIndex: indexTharr
                  });
                }

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.handleSubmit = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(e) {
        var value, data;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                value = e.detail.value;
                data = _extends({}, _this.state.info, value);


                if (!data.is_def) {
                  data.is_def = 0;
                }

                if (data.username) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", _index7.default.toast('请输入收件人'));

              case 5:
                if (!(!data.telephone || !/1\d{10}/.test(data.telephone))) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt("return", _index7.default.toast('请输入正确的手机号'));

              case 7:
                if (data.area) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return", _index7.default.toast('请选择所在区域'));

              case 9:
                if (data.adrdetail) {
                  _context3.next = 11;
                  break;
                }

                return _context3.abrupt("return", _index7.default.toast('请输入详细地址'));

              case 11:
                // console.log(data, 182)
                // return false
                _this.props.onChange && _this.__triggerPropsFn("onChange", [null].concat([data]));
                _this.props.onClose && _this.__triggerPropsFn("onClose", [null].concat([]));

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.handleChange = function (name, val) {
      var info = _this.state.info;

      info[name] = val;
      console.log(info);
    }, _this.handleDefChange = function (val) {
      var info = _extends({}, _this.state.info, {
        is_def: val ? 1 : 0
      });

      _this.setState({
        info: info
      });
    }, _this.handleDelete = function () {
      _this.__triggerPropsFn("onDelete", [null].concat([_this.state.info]));
    }, _this.handleBlur = function (e) {
      console.log(e);
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AddressEdit, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AddressEdit.prototype.__proto__ || Object.getPrototypeOf(AddressEdit.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: _extends({}, this.props.value),
        list: [],
        areaList: [],
        multiIndex: []
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
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var res, nList, arr_label, s_arr_label, th_arr_label, arr, s_arr, th_arr, all_arr;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _index4.default.member.areaList();

              case 2:
                res = _context4.sent;
                nList = (0, _index5.pickBy)(res, {
                  label: 'label',
                  children: 'children'
                });
                arr_label = [];
                s_arr_label = [];
                th_arr_label = [];
                arr = [];
                s_arr = [];
                th_arr = [];
                all_arr = [];

                res.map(function (item) {
                  arr_label.push(item.label);
                  arr.push({ label: item.label, children: item.children });
                });
                arr[0].children.map(function (item) {
                  s_arr_label.push(item.label);
                  s_arr.push({ label: item.label, children: item.children });
                });
                s_arr[0].children.map(function (item) {
                  th_arr_label.push(item.label);
                  th_arr.push({ label: item.label, children: item.children });
                });
                all_arr[0] = arr_label;
                all_arr[1] = s_arr_label;
                all_arr[2] = th_arr_label;
                this.setState({
                  areaList: all_arr,
                  list: nList,
                  multiIndex: [0, 0, 0]
                });
                console.log(all_arr, arr, s_arr, th_arr, 31);

              case 19:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetch() {
        return _ref5.apply(this, arguments);
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

      var anonymousState__temp = _index2.default.getEnv() === 'WEAPP';
      var anonymousState__temp2 = _index2.default.getEnv() === 'WEB';
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2
      });
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
}, _class.$$events = ["handleSubmit", "handleChange", "handleBlur", "bindMultiPickerChange", "bindMultiPickerColumnChange", "handleDefChange", "handleDelete"], _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = AddressEdit;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(AddressEdit));