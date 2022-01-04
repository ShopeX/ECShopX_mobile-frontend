export default class Base {
  constructor (options = {}) {
    this.options = options
  }

  setVar () {}
  trackEvent () {}

  componentDidMount () {}
  componentDidHide () {}

  dispatch (type, payload) {
    try {
      const actions = this.actions
      if (!actions) {
        console.error('tracker actions not found:')
        return
      }
      if (actions) {
        const fn = actions[type]
        if (fn) {
          if (typeof payload === 'function') {
            payload = payload(this)
          }
          return fn(payload)
        }

        console.error('tracker action not defined: ', type, ' payload: ', payload)
      }
    } catch (e) {
      console.error(e)
    }
  }
}
