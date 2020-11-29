/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/home/wgts/header-home.js
 * @Date: 2020-10-26 11:03:06
 * @LastEditors: Arvin
 * @LastEditTime: 2020-10-29 16:55:56
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { toggleTouchMove } from '@/utils/dom'
import { getQueryVariable } from '@/utils'

import './header-home.scss'

export default class HeaderHome extends Component {
  static defaultProps = {
    storeName: null,
    isOpenScanQrcode: 2
  }

  constructor (props) {
    super(props)

    this.state = {
      searchValue: '',
      historyList: [],
      isShowAction: false
    }
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'h5') {
      toggleTouchMove(this.refs.container)
    }
  }

  handlePickStore = () => {
    if (this.props.onClickItem) {
      this.props.onClickItem()
    }
    Taro.navigateTo({
      url: '/pages/store/list'
    })
  }

  handleScanCode = () => {
    Taro.scanCode().then(res => {
      var scene = decodeURIComponent(res.path)
      var path = scene.replace('pages/', '')
      path = path.replace('scene=', '')
      //格式化二维码参数
      const query = getQueryVariable(path)
      if (query.cid && query.t) {
        Taro.navigateTo({
          url: `/others/pages/auth/index?cid=${query.cid}&token=${query.t}`
        })
      } else {
        Taro.navigateTo({
          url: path
        })
      }
    })
  }

  render () {
    const { store, isOpenScanQrcode,isOpenStoreStatus } = this.props
    const isNoStores = isOpenStoreStatus ? false : true    
    return (
      <View className='home-header'>

            <View className='nearly-shop'>
              <View className='shop-view view-flex-item view-flex view-flex-middle'>
                {
                    isNoStores && store.name && (
                      <View  onClick={this.handlePickStore.bind(this)}>
                      <View className='icon-periscope'></View>
                      <View className='shop-name'>{store.name || '选择店铺'}</View>
                      <View className='icon-arrowDown'></View>
                    </View>
                    )
                  }
              </View>
    
              {
                Taro.getEnv() !== 'WEB' && isOpenScanQrcode==1 && <View className='scancode' onClick={this.handleScanCode.bind(this)}>
                  <View className='iconfont icon-scan'></View>
                  <View>扫码</View>
                </View>
              }
            </View>
      </View>
    )
  }
}
