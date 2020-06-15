import Taro, { Component } from '@tarojs/taro'
import {View, Form, Text, Image} from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { classNames } from '@/utils'
import { toggleTouchMove } from '@/utils/dom'

import './header-home.scss'

export default class HeaderHome extends Component {
  static defaultProps = {
    storeName: null
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
      Taro.navigateTo({
        url: path
      })
    })
  }

  render () {
    const { store } = this.props
    return (
      <View class="home-header">
        {
          store.name &&
            <View className="nearly-shop">
              <View className="shop-view view-flex-item view-flex view-flex-middle" onClick={this.handlePickStore.bind(this)}>
                <View className="icon-periscope"></View>
                <View className="shop-name">{store.name || '选择店铺'}</View>
                <View className="icon-arrowDown"></View>
              </View>
              <View className="scancode" onClick={this.handleScanCode.bind(this)}>
                <View className="icon-scan"></View>
                <View>扫码</View>
              </View>
            </View>
        }
      </View>
    )
  }
}
