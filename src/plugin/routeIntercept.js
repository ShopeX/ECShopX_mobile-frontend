import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import {} from '@/utils'

class RouteIntercept {
  constructor() {
    this.app_platform = process.env.APP_PLATFORM
    this.routes = {
      'in_purchase': {
        '/pages/item/espier-detail': '/subpages/purchase/espier-detail'
      }
    }
  }

  init() {
    const _navigateTo = Taro.navigateTo
    const _redirectTo = Taro.redirectTo
    Taro.navigateTo = (params) => {
      const _params = this.transformParams(params)
      _navigateTo(_params)      
    }

    Taro.redirectTo = (params) => {
      const _params = this.transformParams(params)
      _redirectTo(_params)
    }
  }

  transformParams(params) {
    if(this.routes?.[this.app_platform]) {
      const path = params.url.split('?')[0]
      if(this.routes[this.app_platform]?.[path]) {
        const newPath = path.replace(/\//gm, '\\/')
        const regexp = new RegExp(`^${newPath}`)
        params.url = params.url.replace(regexp, this.routes[this.app_platform]?.[path])
      } 
    } 
    return params
  }
}

const intercept = new RouteIntercept()
export {
  intercept
}
