import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import api from '@/api'

import './store-fav-item.scss'

export default class StoreFavItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  handleFavRemove = async (id) => {
    const { confirm } = await Taro.showModal({
      title: '提示',
      content: `确认取消关注当前店铺吗`,
      confirmColor: '#0b4137',
      confirmText: '确认',
      cancelText: '取消'
    })
    if (!confirm) return
    const { status } = await api.member.storeFavDel(id)
    if (status) {
      console.log(this.props)
      this.props.onCancel()
    }
  }

  render() {
    const { info, onClick } = this.props

    return (
      <View className='fav-store__item' onClick={onClick}>
        <Image className='fav-store__item-brand' src={info.logo} mode='aspectFill' />
        <View className='fav-store__item-info'>
          <View>{info.name}</View>
          <View className='store-fav-count'>{info.fav_num}人关注</View>
        </View>
        <View
          className='fav-store__item-cancel'
          onClick={this.handleFavRemove.bind(this, info.distributor_id)}
        >
          取消关注
        </View>
      </View>
    )
  }
}
