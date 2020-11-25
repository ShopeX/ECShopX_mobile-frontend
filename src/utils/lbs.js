/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 定位服务
 * @FilePath: /unite-vshop/src/utils/lbs.js
 * @Date: 2020-01-09 10:36:54
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-14 14:08:24
 */

class LBS {
  constructor () {
    if(process.env.TARO_ENV === 'h5'){
      this.loadJScript()
    }
  }

  // 加载地图sdk
  loadJScript() {
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `https://apis.map.qq.com/tools/geolocation/min?key=${APP_MAP_KEY}&referer=${APP_MAP_NAME}`
    document.body.appendChild(script)
  }
}

export default LBS