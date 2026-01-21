/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
        '/subpages/item/list': '/subpages/purchase/list'
      },
      'standard': {
        // 如果是standard并且store里有活动id时,会存在内购商城，内购商城里的页面需要进行进行路由代理
        '/subpages/item/list': '/subpages/purchase/list',
        '/pages/item/espier-detail': '/subpages/purchase/espier-detail',
        '/pages/cart/espier-checkout': '/subpages/purchase/espier-checkout'
      },
      'platform': {
        // 如果是platform并且store里有活动id时,会存在内购商城，内购商城里的页面需要进行进行路由代理
        '/subpages/item/list': '/subpages/purchase/list',
        '/pages/item/espier-detail': '/subpages/purchase/espier-detail',
        '/pages/cart/espier-checkout': '/subpages/purchase/espier-checkout'
      },
      'b2c': {
        // 如果是b2c并且store里有活动id时,会存在内购商城，内购商城里的页面需要进行进行路由代理
        '/subpages/item/list': '/subpages/purchase/list',
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
    if (process.env.TARO_ENV === 'h5') {
      // H5 环境
      const _pushState = window.history.pushState
      const _replaceState = window.history.replaceState
      const self = this

      // 重写 pushState
      window.history.pushState = function (state, title, url) {
        if (url) {
          const newPath = self.formartParams({ url })
          _pushState.call(window.history, state, title, newPath.url)
        } else {
          _pushState.call(window.history, state, title, url)
        }
      }

      // 重写 replaceState
      window.history.replaceState = function (state, title, url) {
        if (url) {
          const newPath = self.formartParams({ url })
          _replaceState.call(window.history, state, title, newPath.url)
        } else {
          _replaceState.call(window.history, state, title, url)
        }
      }

      // 监听 popstate 事件
      // window.addEventListener('popstate', (e) => {
      //   const url = window.location.pathname + window.location.search;
      //   const newPath = this.formartParams({ url });
      //   if (newPath.url !== url) {
      //     window.history.replaceState(null, '', newPath.url);
      //   }
      // });
    } else {
      const _navigateTo = Taro.navigateTo
      const _redirectTo = Taro.redirectTo

      Taro.navigateTo = (params) => {
        const _params = this.formartParams(params)
        // 检查页面栈深度，如果达到9层，先销毁部分旧页面
        const pages = getCurrentPages()
        if (pages.length > 8) {
          _redirectTo(_params)
        } else {
          _navigateTo(_params)
        }
      }

      Taro.redirectTo = (params) => {
        const _params = this.formartParams(params)
        _redirectTo(_params)
      }
    }
  }

  formartParams(params) {
    //_original=1标识=>不重定向。并且去除标识
    if (params.url?.includes('_original=1')) {
      // 移除 _original=1 参数及其连接符
      params.url = params.url.replace(/[?&]_original=1($|&)/, (match, p1) => {
        // 如果是最后一个参数，返回空字符串
        // 如果后面还有其他参数，返回 ? 或保留 &
        return match.startsWith('?') ? (p1 === '&' ? '?' : '') : ''
      })
      return params
    }

    const activity_id = store.getState()?.purchase?.purchase_share_info?.activity_id
    const sp_platform =
      this.app_platform == 'standard' ||
      this.app_platform == 'platform' ||
      this.app_platform == 'b2c'
    const in_platform = this.app_platform == 'in_purchase'
    if (this.routes?.[this.app_platform] && in_platform) {
      params = this.transformParams(params)
    }
    if (this.routes?.[this.app_platform] && sp_platform && activity_id) {
      params = this.transformParams(params)
    }
    return params
  }

  transformParams(params) {
    const path = params.url.split('?')[0]
    if (this.routes[this.app_platform]?.[path]) {
      const newPath = path.replace(/\//gm, '\\/')
      const regexp = new RegExp(`^${newPath}`)
      params.url = params.url.replace(regexp, this.routes[this.app_platform]?.[path])
    }
    return params
  }
}

const intercept = new RouteIntercept()
export { intercept }
