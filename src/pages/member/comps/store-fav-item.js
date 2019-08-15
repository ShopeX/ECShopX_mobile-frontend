import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { copyText } from '@/utils'
import { AtCurtain } from "taro-ui";
import { Loading, SpToast } from "@/components";

import './store-fav-item.scss';

export default class StoreFavItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  render () {
    const { info, onClick } = this.props

    return (
      <View
        className="fav-store__item"
        onClick={onClick}
        >
        <Image
          className="fav-store__item-brand"
          mode="aspectFit"
        />
        <View className="fav-store__item-info">
          <View>{info.name}</View>
          <View className="store-fav-count">{info.fav_num}人关注</View>
        </View>
        <View className="fav-store__item-cancel">取消关注</View>
      </View>
    )
  }
}
