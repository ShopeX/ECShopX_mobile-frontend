"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withBackToTop;

var _index = require("../utils/index.js");

var _throttle = require("../npm/lodash/throttle.js");

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function withBackToTop(Component) {
  return function (_Component) {
    _inherits(WithBackToTopComponent, _Component);

    function WithBackToTopComponent(props) {
      _classCallCheck(this, WithBackToTopComponent);

      var _this = _possibleConstructorReturn(this, (WithBackToTopComponent.__proto__ || Object.getPrototypeOf(WithBackToTopComponent)).call(this, props));

      _this.scrollBackToTop = function () {
        // workaround
        _this.setState({
          scrollTop: 1
        }, function () {
          {
            // workaround for weapp
            console.log(17);
            _this.setState({
              scrollTop: null
            });
          }
        });
      };

      _this.handleScroll = (0, _throttle2.default)(function (e) {
        var _e$detail = e.detail,
            scrollTop = _e$detail.scrollTop,
            scrollHeight = _e$detail.scrollHeight;

        var offset = 300;
        // this.setState({
        //   scrollTop
        // })

        if (scrollHeight < 600) return;
        if (scrollTop > offset && !_this.state.showBackToTop) {
          _index.log.debug("[BackToTop] showBackToTop, scrollTop: " + scrollTop);
          _this.setState({
            showBackToTop: true
          });
        } else if (_this.state.showBackToTop && scrollTop <= offset) {
          _index.log.debug("[BackToTop] hideBackToTop, scrollTop: " + scrollTop);
          _this.setState({
            showBackToTop: false
          });
        }
      }, 70);


      _this.state = _extends({}, _this.state, {
        scrollTop: null,
        showBackToTop: false
      });
      return _this;
    }

    return WithBackToTopComponent;
  }(Component);
}