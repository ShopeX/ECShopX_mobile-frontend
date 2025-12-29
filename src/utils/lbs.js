/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.qq) {
      resolve(window.qq)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      // script.src = `https://map.qq.com/api/js?v=2.exp&key=${process.env.APP_MAP_KEY}&callback=qqMapOnLoad&libraries=place,geometry,geocoder`
      script.src = `https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js`
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.qqMapOnLoad = () => {
      resolve(window.qq)
    }
  })
}
