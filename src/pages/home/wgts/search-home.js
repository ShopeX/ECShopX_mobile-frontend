import Taro, { Component } from '@tarojs/taro'
import {View, Icon} from '@tarojs/components'
import { toggleTouchMove } from '@/utils/dom'

import './search-home.scss'

export default class WgtSearchHome extends Component {
  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)

    this.state = {
      searchValue: '',
      historyList: [],
      isShowAction: false
    }
  }
  componentDidMount () {
    if (process.env.TARO_ENV === 'h5') {
      toggleTouchMove(this.refs.container)
    }
  }

  static options = {
    addGlobalClass: true
  }

  searchTap = () => {
    const { dis_id } = this.props
    const dId = dis_id ? `?dis_id=${dis_id}` : ''
    const url = dId ? `/others/pages/store/list${dId}`: `/pages/item/list`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, config } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        <View className={`search ${config.fixTop ? 'fixed' : null}`}>
          <View className={`content-padded ${base.padded ? 'wgt__padded' : null}`}>
            <View className='search-box view-flex view-flex-middle view-flex-center' onClick={this.searchTap.bind(this)}>
              <Icon className='iconfont search-icon' type='search' size='14' color='#999999'></Icon>
              <View>输入商品名称</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
