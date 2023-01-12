import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import configStore from '@/store'
const { store } = configStore()

class RouteIntercept {
  constructor() {
    this.app_platform = process.env.APP_PLATFORM
    this.routes = {
      'in_purchase': {
        '/pages/item/espier-detail': '/subpages/purchase/espier-detail',
        '/pages/cart/espier-checkout': '/subpages/purchase/espier-checkout',
        '/subpages/member/index': '/subpages/purchase/member',
        '/pages/category/index': '/subpages/purchase/category',
        '/pages/cart/espier-index': '/subpages/purchase/espier-index',
        '/pages/item/list': '/subpages/purchase/list',
      },
      'standard': { // 如果是standard并且store里有活动id时,会存在内购商城，内购商城里的页面需要进行进行路由代理
        '/pages/item/list': '/subpages/purchase/list',
        '/pages/item/espier-detail': '/subpages/purchase/espier-detail',
        '/pages/cart/espier-checkout': '/subpages/purchase/espier-checkout'
      },
      'platform': { // 如果是platform并且store里有活动id时,会存在内购商城，内购商城里的页面需要进行进行路由代理
        '/pages/item/list': '/subpages/purchase/list',
        '/pages/item/espier-detail': '/subpages/purchase/espier-detail',
        '/pages/cart/espier-checkout': '/subpages/purchase/espier-checkout'
      }
      // 'standard': {
      //   '/pages/item/espier-detail': '/subpages/pointshop/espier-detail',
      //   '/pages/cart/espier-checkout': '/subpages/pointshop/espier-checkout'
      // }
    }
  }

  init() {
    const _navigateTo = Taro.navigateTo
    const _redirectTo = Taro.redirectTo
    Taro.navigateTo = (params) => {
      const _params = this.formartParams(params)
      _navigateTo(_params)
    }

    Taro.redirectTo = (params) => {
      const _params = this.formartParams(params)
      _redirectTo(_params)
    }
  }

  formartParams(params) {
    const activity_id = store.getState()?.purchase?.purchase_share_info?.activity_id
    const sp_platform = this.app_platform == 'standard' || this.app_platform == 'platform'
    const in_platform = this.app_platform == 'in_purchase'
    if(this.routes?.[this.app_platform] && in_platform) {
      params = this.transformParams(params)
    }
    if (this.routes?.[this.app_platform] && sp_platform && activity_id) {
      params = this.transformParams(params)
    }
    return params
  }

  transformParams (params) {
    const path = params.url.split('?')[0]
    if(this.routes[this.app_platform]?.[path]) {
      const newPath = path.replace(/\//gm, '\\/')
      const regexp = new RegExp(`^${newPath}`)
      params.url = params.url.replace(regexp, this.routes[this.app_platform]?.[path])
    }
    return params
  }
}

const intercept = new RouteIntercept()
export {
  intercept
}
