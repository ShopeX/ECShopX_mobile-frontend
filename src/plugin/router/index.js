import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
class PRouter {
  constructor() {
    console.log('Taro', Taro)
    // debugger
  }

  init() {
    console.log('Taro', Taro)
    
    const _navigateTo = Taro.navigateTo
    Taro.navigateTo = (params) => {
      
      const { url } = params
      params.url = params.url.replace(/^\/pages\/item\/espier-detail/, '/subpages/member/index')
      debugger
      _navigateTo(params)
    }

  }
}

export default new PRouter()