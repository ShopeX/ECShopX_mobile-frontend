export default class Base {
  constructor(options = {}) {
    this.options = options;
  }

  setVar() {}
  trackEvent() {}

  dispatch(type, payload) {
    try {
      const actions = this.actions;
      if (!actions) {
        throw new Error("tracker actions not found");
      }
      if (actions) {
        const fn = actions[type];
        if (fn) {
          if (typeof payload === "function") {
            payload = payload(this);
          }
          return fn(payload);
        }
        console.error(
          "tracker action not defined: ",
          type,
          " payload: ",
          payload
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}
