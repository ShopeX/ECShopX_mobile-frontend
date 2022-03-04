import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Icon } from '@tarojs/components'
import { toggleTouchMove } from '@/utils/dom'
import { getQueryVariable } from '@/utils'
import './search-home.scss'

export default class WgtSearchHome extends Component {
  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      searchValue: '',
      historyList: [],
      isShowAction: false
    }
  }
  componentDidMount() {
    if (process.env.TARO_ENV === 'h5') {
      toggleTouchMove(this.refs.container)
    }
  }

  static options = {
    addGlobalClass: true
  }

  searchTap = () => {
    Taro.navigateTo({
      url: `/guide/item/list`
    })
  }

  handleScanCode = () => {
    Taro.scanCode().then((res) => {
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

  render() {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, config } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        <View className={`search ${config.fixTop ? 'fixed' : null}`}>
          <View className={`content-padded ${base.padded ? 'wgt__padded' : null}`}>
            <View
              className='search-box view-flex view-flex-middle view-flex-center'
              onClick={this.searchTap.bind(this)}
            >
              <Icon className='iconfont search-icon' type='search' size='14' color='#999999'></Icon>
              <View>输入商品名称</View>
            </View>
          </View>
          {/* {
              Taro.getEnv() !== 'WEB' && config.scanCode == 1 && process.env.APP_PLATFORM !== 'standard' && <View className='scancode' onClick={this.handleScanCode.bind(this)}>
                <View className='iconfont icon-scan'></View>
                <View>扫码</View>
              </View>
            }             */}
        </View>
      </View>
    )
  }
}
