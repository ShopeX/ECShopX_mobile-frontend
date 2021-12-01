import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './cus-list-item.scss'

@connect(({ colors }) => ({
  colors: colors.current || { data: [{}] }
}))
export default class StoreListItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  handleClick = (info) => {
    console.log(info, '----info---')
    // this.props.onClick && this.props.onClick()
  }

  render() {
    const { info, isStore, colors } = this.props
    if (!info) return null
    const distance = info.distance ? (info.distance * 1).toFixed(2) : false

    return (
      <View className='cus-list-item' onClick={this.handleClick.bind(this, info)}>
        <View className='list-left'>
          <Image className='list-imgs' src='https://b-img-cdn.yuanyuanke.cn/image/21/2021/09/09/e256a607a5914062d406916bc22b1465BRHbeKZOlgTyIDnPmitVXJESiSXLCaDk?imageView2/2/w/400'></Image>
        </View>
        <View className='list-center'>
          <View className='list-title'>{info.name}</View>
          <View className='list-time'>
            <Text className='iconfont icon-clock1 clockicons'/>
            <Text>{info.hour}</Text>
          </View>
          <View className='list-adress'>
            <Text className='iconfont icon-dizhiguanli-01 adressicons'/>
            <Text>{info.store_address}</Text>
          </View>

          <View className='list-tag'>
            {info.tagList.map(item => <View className='tags' key={item.tag_id}>{item.tag_name}</View>)}
          </View>
        </View>
        {
          distance &&
          <View className='list-right'>{distance}{info.distance_unit}</View>
        }
      </View>
    )
  }
}
