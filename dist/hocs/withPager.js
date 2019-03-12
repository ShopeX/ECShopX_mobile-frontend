"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = withPager;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// this.fetch 方法需要返回条数总量: { total }，用来计算页数
// this.state.page 存放page相关的状态

function withPager(Component) {
  var _class, _temp, _initialiseProps;

  return _temp = _class = function (_Component) {
    _inherits(WithPagerComponent, _Component);

    function WithPagerComponent(props) {
      _classCallCheck(this, WithPagerComponent);

      var _this = _possibleConstructorReturn(this, (WithPagerComponent.__proto__ || Object.getPrototypeOf(WithPagerComponent)).call(this, props));

      _initialiseProps.call(_this);

      var _ref = props || {},
          _ref$pageSize = _ref.pageSize,
          pageSize = _ref$pageSize === undefined ? 10 : _ref$pageSize,
          _ref$pageNo = _ref.pageNo,
          pageNo = _ref$pageNo === undefined ? 0 : _ref$pageNo,
          _ref$pageTotal = _ref.pageTotal,
          pageTotal = _ref$pageTotal === undefined ? 0 : _ref$pageTotal;

      var page = {
        hasNext: true,
        isLoading: false,
        total: pageTotal,
        page_no: pageNo,
        page_size: pageSize
      };

      _this.state.page = page;
      return _this;
    }

    _createClass(WithPagerComponent, [{
      key: "resetPage",
      value: function resetPage() {
        var page = _extends({}, this.state.page || {}, {
          page_no: 0,
          total: 0,
          isLoading: false,
          hasNext: true
        });

        this.setState({ page: page });
      }
    }]);

    return WithPagerComponent;
  }(Component), _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.nextPage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var page, page_no, page_size, curPage, _ref3, total;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              page = _this2.state.page;

              if (page.hasNext) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:

              page.isLoading = true;
              _this2.setState({
                page: page
              });

              page_no = page.page_no, page_size = page.page_size;
              curPage = page_no + 1;
              _context.next = 9;
              return _this2.fetch({
                page_no: curPage,
                page_size: page_size
              });

            case 9:
              _ref3 = _context.sent;
              total = _ref3.total;


              if (!total || curPage >= Math.ceil(total / page_size)) {
                page.hasNext = false;
              }

              _this2.setState({
                page: _extends({}, page, {
                  total: total,
                  page_no: curPage,
                  isLoading: false
                })
              });

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));
  }, _temp;
}