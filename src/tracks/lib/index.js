import trackConfig from "../index";
import {
  getBoundingClientRect,
  isClickTrackArea,
  getActivePage
} from "./helper";

const LIFE_TIME = ["componentDidMount", "componentDidShow", "componentDidHide"];

export default function withTracker(Component) {
  return class WithTrackerComponent extends Component {
    constructor(props) {
      super(props);
      this.page = this;
      debugger;
    }

    async componentDidMount() {
      this.methodTracker();
      if (super.componentDidMount) {
        super.componentDidMount();
        this._componentDidMount && this._componentDidMount();
      }
    }

    async componentDidShow() {
      if (super.componentDidShow) {
        super.componentDidShow();
        this._componentDidShow && this._componentDidShow();
      }
    }

    async componentDidHide() {
      if (super.componentDidHide) {
        super.componentDidHide();
        this._componentDidHide && this._componentDidHide();
      }
    }

    elementTracker = e => {
      // 页面埋点配置
      const { route } = getActivePage();
      const config = trackConfig.find(item => item.path == route);
      config.elementTracks.forEach(item => {
        getBoundingClientRect(item.element).then(res => {
          res.boundingClientRect.forEach(ele => {
            const isHit = isClickTrackArea(e, ele, res.scrollOffset);
            isHit && this.report(config.path, item);
          });
        });
      });
    };

    methodTracker = () => {
      const { route } = getActivePage();
      const { page } = this;
      // 页面埋点配置
      const config = trackConfig.find(item => item.path == route);
      config.methodTracks.forEach(item => {
        const methodName = item.method;
        if (typeof page[methodName] === "function") {
          if (LIFE_TIME.indexOf(methodName) > -1) {
            this._wrapTargetMethod(page, `_${methodName}`, config.path, item);
          } else {
            this._wrapTargetMethod(page, methodName, config.path, item);
          }
        }
      });
    };

    _wrapTargetMethod(target, methodName, path, item) {
      const methodFunction = target[methodName];

      target[methodName] = function _aa(...args) {
        const result = methodFunction && methodFunction.apply(this, args);
        const methodExcuter = () => {
          // methods.forEach(fn => {
          //   fn.apply(this, [target, methodName, ...args]);
          // });
          this.report(path, item, args);
        };
        try {
          if (Object.prototype.toString.call(result) === "[object Promise]") {
            result
              .then(() => {
                methodExcuter();
              })
              .catch(() => {
                methodExcuter();
              });
          } else {
            methodExcuter();
          }
        } catch (e) {
          console.error(methodName, "钩子函数执行出现错误", e);
        }
        return result;
      };
    }

    report(path, track, args) {
      const { element, method, dataKeys } = track;
      const logger = [];
      if (Object.prototype.toString.call(dataKeys) == "[object Function]") {
        const data = dataKeys(this, args[0]);
        logger.push({ path, element, method, name: "", data });
      } else {
        dataKeys.forEach(name => {
          const data = this.state[name];
          logger.push({ path, element, method, name, data });
        });
      }
      console.table(logger);
    }
  };
}
