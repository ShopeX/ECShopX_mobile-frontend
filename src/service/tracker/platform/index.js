const providers = {};

if (process.env.TARO_ENV == "weapp") {
  Object.assign(providers, {
    [APP_TRACK]: require(`./` + APP_TRACK).default
  });
}

class Trackers {
  constructor() {
    this.providers = providers
  }

  get(name, options) {
    const Tracker = this.providers[name]
    return new Tracker(options)
  }
}

export default new Trackers()
