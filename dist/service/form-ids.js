"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../api/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormIds = function () {
  function FormIds() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, FormIds);

    this._collectingFormIdsTimer = null;
    this._formIds = [];
    this.options = _extends({
      duration: 30000
    }, options);
  }

  _createClass(FormIds, [{
    key: "startCollectingFormIds",
    value: function startCollectingFormIds() {
      var _this = this;

      if (this._collectingFormIdsTimer) {
        clearInterval(this._collectingFormIdsTimer);
      }

      var collecting = function collecting() {
        _this.flush();
      };

      this._collectingFormIdsTimer = setInterval(collecting, this.options.duration);
      _index3.log.debug("[form-ids] start collecting");
    }
  }, {
    key: "collectFormIds",
    value: function collectFormIds(ids, sync) {
      if (!ids) return;
      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      if (sync) {
        this.flush(ids);
      } else {
        this._formIds = [].concat(_toConsumableArray(this._formIds), _toConsumableArray(ids));
      }
    }
  }, {
    key: "flush",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var needsMerge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var needsClean = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (needsMerge) {
                  ids = [].concat(_toConsumableArray(this._formIds), _toConsumableArray(ids));
                }
                ids = ids.filter(function (id) {
                  return id !== 'the formId is a mock one';
                });

                if (ids.length) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return");

              case 4:
                ids = ids.join(',');

                _index3.log.debug("[form-ids] sending ids: ", ids);

                _context.prev = 6;
                _context.next = 9;
                return _index2.default.member.fomrId(ids);

              case 9:
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](6);

                console.log(_context.t0);

              case 14:

                if (needsClean) {
                  this._formIds = [];
                }

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 11]]);
      }));

      function flush() {
        return _ref.apply(this, arguments);
      }

      return flush;
    }()
  }, {
    key: "stop",
    value: function stop() {
      if (this._collectingFormIdsTimer) {
        clearInterval(this._collectingFormIdsTimer);
        _index3.log.debug("[form-ids] stop collecting");
      }
    }
  }]);

  return FormIds;
}();

exports.default = new FormIds();