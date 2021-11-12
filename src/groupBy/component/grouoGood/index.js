/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 团购商品
 * @FilePath: /unite-vshop/src/groupBy/component/grouoGood/index.js
 * @Date: 2020-04-23 18:06:17
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-23 14:43:51
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import api from '@/api'
import { formatCountTime } from '../../utils/index'
import GoodItem from '../goodItem'
import BuyerItem from '../buyerItem'

import './index.scss'

export default class GroupGood extends Component {
  static defaultProps = {
    info: {
      good: [],
      buyer: [],
      time: 0,
      deliveryDate: ''
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      timeId: '',
      countTime: props.info.time || 0,
      isEnd: false,
      list: props.info.good || []
    }
  }

  componentDidMount () {
    // 执行倒计时
    this.countdown()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.info.time !== this.props.info.time) {
      const { timeId } = this.state
      if (timeId) {
        clearTimeout(timeId)
      }
      this.setState(
        {
          countTime: nextProps.info.time,
          timeId: '',
          list: nextProps.info.good || [],
          isEnd: false
        },
        () => {
          this.countdown()
        }
      )
    }
  }

  componentWillUnmount () {
    let { timeId } = this.state
    if (timeId) {
      clearTimeout(timeId)
    }
  }

  // 倒计时
  countdown = () => {
    let { countTime, timeId } = this.state
    if (countTime > 0) {
      timeId = setTimeout(() => {
        this.setState(
          {
            countTime: countTime - 1
          },
          () => {
            this.countdown()
          }
        )
      }, 1000)
    } else {
      // 清除倒计时
      timeId = ''
      clearTimeout(timeId)
      if (timeId) {
        // 刷新
        this.props.onRefesh && this.props.onRefesh()
      }
    }
    this.setState({
      timeId,
      isEnd: timeId === ''
    })
  }

  // 修改商品数量
  setGoodNum = (itemId, type) => {
    const currentCommunity = Taro.getStorageSync('community')
    const { list } = this.state
    const index = list.findIndex((item) => item.itemId === itemId)
    const num = list[index].num
    if (type === 'add') {
      list[index].num = num ? num + 1 : 1
    } else {
      list[index].num = num && num > 1 ? num - 1 : 0
    }
    api.groupBy
      .updateCart({
        item_id: list[index].itemId,
        num: list[index].num,
        shop_id: currentCommunity.community_id,
        activity_id: list[index].activity_id,
        shop_type: 'community',
        activity_type: 'community',
        order_class: 'community',
        isAccumulate: false
      })
      .then(() => {
        this.setState({
          list: list
        })
      })
  }

  goNextNotice = () => {
    Taro.navigateTo({
      url: '/groupBy/pages/nextNotice/index'
    })
  }

  render () {
    const { countTime, isEnd, list } = this.state
    const { info } = this.props

    return (
      <View className='groupGood'>
        <View className='info'>
          <View className='time'>
            <View className='left'>本期剩余时间{formatCountTime(countTime)}</View>
            <View className='right' onClick={this.goNextNotice.bind(this)}>
              下期预告
              <AtIcon value='chevron-right' size='16'></AtIcon>
            </View>
          </View>
          <View>预计送达：{info.deliveryDate}</View>
        </View>
        {list &&
          list.map((item) => (
            <GoodItem
              key={item.itemId}
              ShowBuyer
              isEnd={isEnd}
              goodInfo={item}
              onSetGoodNum={this.setGoodNum.bind(this)}
            />
          ))}
        {info.buyer &&
          info.buyer.map((item, index) => (
            <BuyerItem key={item} last={index === info.buyer.length - 1} />
          ))}
      </View>
    )
  }
}
