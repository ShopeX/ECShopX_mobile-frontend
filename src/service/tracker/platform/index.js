const providers = {}

if (process.env.TARO_ENV == 'weapp' || process.env.TARO_ENV === 'alipay') {
  Object.assign(providers, {
    [process.env.APP_TRACK]: require(`./` + process.env.APP_TRACK).default
  })
}

class Trackers {
  constructor () {
    this.providers = providers
  }

  get (name, options) {
    const Tracker = this.providers[name]
    return new Tracker(options)
  }
}

export default new Trackers()
