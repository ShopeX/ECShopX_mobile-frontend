/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 商品Item
 * @FilePath: /unite-vshop/src/groupBy/component/goodItem/index.js
 * @Date: 2020-04-24 09:46:24
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-20 11:17:34
 */
import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import BuyContorl from '../buyContorl'

import './index.scss'

export default class GoodItem extends Component {
  static defaultProps = {
    goodInfo: {},
    // 是否结束
    isEnd: false,
    // 是否显示最近购买
    ShowBuyer: false,
    // 是否下期预告
    isNext: false,
    // 是否显示选择框
    ShowCheckBox: false,
    // 是否显示过期
    isExpired: false,
    // 数量为1时是否可以继续减少
    isCanReduce: false
  }

  constructor(props) {
    super(props)
  }

  // 调整购买数量
  setGoodNum = (itemId, type) => {
    // 调取父组件事件
    this.props.onSetGoodNum && this.props.onSetGoodNum(itemId, type)
  }

  // 选中事件
  handleCheck = (itemId, e) => {
    e.stopPropagation()
    // 调用父组件事件
    this.props.onCheckItem && this.props.onCheckItem(itemId)
  }

  // 点击跳转
  handleItem = (itemId, activeId) => {
    const currentCommunity = Taro.getStorageSync('community')
    const { isNext } = this.props
    Taro.navigateTo({
      url: `/groupBy/pages/goodDetail/index?itemId=${itemId}&activeId=${activeId}&cid=${currentCommunity.community_id}&isNext=${isNext}`
    })
  }

  // 处理价格显示
  showPrice = (item) => {
    if (!item.activity_price) return
    const userInfo = Taro.getStorageSync('userinfo') || {}
    let price = item.activity_price
    const vipPrice = Number(item.vip_price)
    const svippPrice = Number(item.svip_price)
    if (userInfo.vip === 'vip' && vipPrice !== 0) {
      price = item.vip_price
    }
    if (userInfo.vip === 'svip' && svippPrice !== 0) {
      price = item.svip_price
    }
    return price
  }

  render() {
    const { goodInfo, isEnd, ShowBuyer, ShowCheckBox, isExpired, isCanReduce, isNext } = this.props

    return (
      <View
        className='goodItem'
        onClick={this.handleItem.bind(this, goodInfo.itemId, goodInfo.activity_id)}
      >
        {ShowCheckBox && (
          <View
            className={`checkBox ${goodInfo.isChecked && 'isChecked'}`}
            onClick={this.handleCheck.bind(this, goodInfo.cartId)}
          >
            {goodInfo.isChecked && <AtIcon value='check' size='12' color='#fff'></AtIcon>}
          </View>
        )}
        <View className='left'>
          <Image src={goodInfo.pics} className='goodImg' />
        </View>
        <View className='right'>
          <View className='goodItem-info'>
            <View className='name'>{goodInfo.itemName}</View>
            <View className='desc'>{goodInfo.brief}</View>
          </View>
          <View className='otherInfo'>
            <View className='otherInfoLeft'>
              <View className='vipTag'>会员专享</View>
              <View className='price'>
                <Text className='symbol'>{goodInfo.symbol}</Text>
                {this.showPrice(goodInfo)}
                <View className='oldPrice'>{goodInfo.price}</View>
              </View>
            </View>
            {!isExpired && !isNext ? (
              <View className='otherInfoRight'>
                {goodInfo.limit_num > 0 && (
                  <View className='limit'>限购{goodInfo.limit_num}件</View>
                )}
                <BuyContorl
                  isEnd={isEnd}
                  store={goodInfo.store}
                  limit={goodInfo.limit_num}
                  quantity={goodInfo.num}
                  isCanReduce={isCanReduce}
                  addQuantity={this.setGoodNum.bind(
                    this,
                    ShowCheckBox ? goodInfo.cartId : goodInfo.itemId,
                    'add'
                  )}
                  reduceQuantity={this.setGoodNum.bind(
                    this,
                    ShowCheckBox ? goodInfo.cartId : goodInfo.itemId,
                    'reduce'
                  )}
                />
              </View>
            ) : (
              <View className='otherInfoExpired'>{isNext ? '尚未开始' : '已经过期'}</View>
            )}
          </View>
          {ShowBuyer && goodInfo.history_data.length > 0 && (
            <View className='buyer'>
              最近购买
              <View className='recent'>
                {goodInfo.history_data.map(
                  (item, index) =>
                    item.headimgurl && (
                      <Image
                        style={`left: -${Taro.pxTransform(index * 20)}`}
                        key={item.headimgurl}
                        className='buyAvatar'
                        src={item.headimgurl}
                      />
                    )
                )}
              </View>
              <View className='num'>{goodInfo.initial_sales}人...</View>
            </View>
          )}
        </View>
      </View>
    )
  }
}
