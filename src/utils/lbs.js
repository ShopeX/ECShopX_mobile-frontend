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
    // script.src = `https://apis.map.qq.com/tools/geolocation/min?key=${process.env.APP_MAP_KEY}&referer=${process.env.APP_MAP_NAME}`

    script.src = `https://webapi.amap.com/maps?v=2.0&key=${process.env.APP_MAP_KEY}`
    // script.src = `https://apis.map.qq.com/tools/geolocation/min?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&effect=zoom`;
    // script.src = `https://map.qq.com/api/js?v=2.exp&key=${process.env.APP_MAP_KEY}`;
    // script.src = `https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js
    // const iframe = document.createElement('iframe')
    // iframe.src = `https://apis.map.qq.com/tools/geolocation?key=T3OBZ-SE6WF-UJCJY-JTL22-EDFA5-TDFIQ&referer=myapp&effect=zoom`;

    document.body.appendChild(script);
  }
}

export default LBS