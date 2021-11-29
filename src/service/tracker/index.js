import Taro from '@tarojs/taro'
import { log } from '@/utils'
import Trackers from './platform'

// import { SOURCE_TYPE } from "./trackers/sensors/consts";

function enable(target, name, descriptor) {
  // if (process.env.APP_TRACK) {
  //   return descriptor
  // }

  descriptor.value = function(params) {
    console.info(`[tracker ${name}]: `, params)
  }
  return descriptor
}

const defaults = {}

class Tracker {
  constructor(options = {}) {
    if (options.provider) {
      this.use(options.provider, options.providerConfig)
    }

    // let _createComponent = Taro.createComponent;
    // var self = this;
    // Taro.createComponent = function(ComponentClass, isPage) {
    //   let obj = _createComponent(ComponentClass, isPage);
    //   const _onReady = obj.methods["onReady"];
    //   obj.methods["onReady"] = function() {
    //     const result = _onReady.apply(this);
    //     self._componentDidMount(this);
    //     return result;
    //   };

    //   const _onShow = obj.methods["onShow"];
    //   obj.methods["onShow"] = function() {
    //     const result = _onShow.apply(this);
    //     self._componentDidShow(this);
    //     return result;
    //   };

    //   const _onHide = obj.methods["onHide"];
    //   obj.methods["onHide"] = function() {
    //     const result = _onHide.apply(this);
    //     self._componentDidHide(this);
    //     return result;
    //   };

    //   // const _onUnload = obj.methods["onUnload"];
    //   obj.methods["onUnload"] = function() {
    //     // const result = _onUnload.apply(this);
    //     self._componentWillUnmount(this);
    //     // return result;
    //   };
    //   return obj;
    // };

    // this.SOURCE_TYPE = SOURCE_TYPE;
  }
  _componentDidShow(e) {
    if (!this._tracker) return
    this._tracker.componentDidShow(e)
  }

  _componentDidMount(e) {
    if (!this._tracker) return
    this._tracker.componentDidMount(e)
  }

  _componentDidHide(e) {
    if (!this._tracker) return
    this._tracker.componentDidHide(e)
  }

  _componentWillUnmount(e) {
    if (!this._tracker) return
    this._tracker.componentWillUnmount(e)
  }

  resolveEvent(...args) {
    let action = 'click'
    let category, label, value

    if (args.length === 1 && Array.isArray(args[0])) {
      ;({ category, action, label, value } = args[0])
    } else if (args.length < 4) {
      ;[category, label, value] = args
    } else {
      ;[category, action, label, value] = args
    }

    return {
      category,
      action,
      label,
      value
    }
  }

  @enable
  use(provider, config) {
    this._tracker = Trackers.get(provider, config)
  }

  @enable
  setVar(params) {
    log.debug('[tracker] setVar: ', params)
    if (!this._tracker) return
    this._tracker.setVar(params)
  }

  @enable
  trackEvents(...events) {
    try {
      if (typeof events[0] === 'string') {
        events = [events]
      }

      events.forEach((e) => {
        const evt = this.resolveEvent.apply(this, Array.isArray(e) ? e : [e])
        // log.debug("[tracker] trackEvents", evt);
        if (!this._tracker) return
        this._tracker.trackEvent(evt)
      })
    } catch (e) {
      console.log(e)
    }
  }

  @enable
  dispatch(type, payload) {
    if (process.env.TARO_ENV === 'alipay') return
    if (!this._tracker) return
    return this._tracker.dispatch(type, payload)
  }
}

function createInstance(options) {
  const inst = new Tracker(options)
  return inst
}

const tracker = createInstance(defaults)

tracker.create = function(opts) {
  createInstance({
    ...defaults,
    ...opts
  })
}

export default tracker
