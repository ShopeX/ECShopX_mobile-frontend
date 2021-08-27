class LBS {
  constructor () {
    if(process.env.TARO_ENV === 'h5'){
      this.loadJScript()
    }
  }

  // 加载地图sdk
  loadJScript() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://apis.map.qq.com/tools/geolocation/min?key=${process.env.APP_MAP_KEY}&referer=${process.env.APP_MAP_NAME}`
    // script.src = `https://map.qq.com/api/js?v=2.exp&key=${process.env.APP_MAP_KEY}`;
    // script.src = `https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js

    document.body.appendChild(script);
  }
}

export default LBS