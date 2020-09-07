export default class Sensors {
  name = "sensors";

  constructor(props) {
    super(props);
    // const { config } = this
    this._init();
  }

  _init() {
    console.log('track sensors init...')
  }

  trackEvent({ category, action, label, value }) {}
}
