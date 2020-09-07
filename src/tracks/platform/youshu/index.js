import sr from "sr-sdk-wxapp";
import conf from "./conf";

export default class YouShu {
  name = "youshu";

  constructor(props) {
    super( props );
    // const { config } = this
    this._init()
  }

  _init() {
    sr.init(conf);
  }

  trackEvent( { category, action, label, value } ) {
    
  }
}
