/*
 * @Author: your name
 * @Date: 2021-02-25 13:14:46
 * @LastEditTime: 2021-02-25 17:48:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/pages/pointitem/comps/header.js
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpImg, PointLine } from '@/components'

import './goods_item.scss'

export default class GoodsItem extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { info = {}, onClick, isStoreOut } = this.props

    return (
      <View class={classNames('goods_item', { 'isStoreOut': isStoreOut })} onClick={onClick}>
        <View class='goods_item_image'>
          <Image src={info.imgUrl} />
        </View>
        <View class='goods_item_name'>{info.item_name}</View>
        <View class='goods_item_score'>
          <PointLine point={info.point} isGoodCard isStoreOut={isStoreOut} />
        </View>

        {isStoreOut && <View class='block'>已兑完</View>}
      </View>
    )
  }
}
