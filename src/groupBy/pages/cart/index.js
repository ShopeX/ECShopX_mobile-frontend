/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 团购购物车
 * @FilePath: /unite-vshop/src/groupBy/pages/cart/index.js
 * @Date: 2020-04-23 16:38:16
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-18 17:40:45
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { NavBar } from '@/components'
import api from '@/api'
import { formatGood } from '../../utils'
import TabBar from '../../component/tabBar'
import CartList from '../../component/cartList'

import './index.scss'

export default class GroupByIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      total: 0,
      list: [],
      failureList: [],
      // 是否全选
      isCheckAll: false
    }
  }


  componentDidMount () {

  }

  componentDidShow () {
    this.getCartData()
  }

  config = {
    navigationBarTitleText: '团购-购物车'
  }

  // 获取购物车数据
  getCartData = (callback = null) => {
    const currentCommunity = Taro.getStorageSync('community')
    Taro.showLoading({title: '请稍等...', mask: true})
    api.groupBy.getCart({
      shop_id: currentCommunity.community_id,
      shop_type: 'community',
      order_type: 'community_normal',
      activity_type: 'community'
    }).then(res => {
      Taro.hideLoading()
      const valid_cart = res.valid_cart[0] || {}
      const invalid_cart = res.invalid_cart[0] || {}
      const isCheckAll = valid_cart && valid_cart.list && valid_cart.list.some(item => item.is_checked)
      this.setState({
        isCheckAll: isCheckAll,
        list: formatGood(valid_cart.list),
        failureList: formatGood(invalid_cart.list)
      }, () => {
        this.calcSum()
      })
      if (callback) callback()
    })
  }

  /**
   * @description: 
   * @param {isCheckAll： 选择状态， isAllBtn： 是否是点击全选按钮触发} 
   * @return: 
   */  
  // 全选
  setCheckAll = (isCheckAll, isAllBtn = true) => {
    this.setState({
      isCheckAll: !isCheckAll
    }, () => {
      isAllBtn && this.cartRef.setCheckAll(!isCheckAll)
      this.calcSum()
    })
  }

  // 计算价格
  calcSum = () => {
    const { list } = this.state
    const sum = list.reduce((total, val) => {
      const price = Number(val.price) * 10 * 10 * val.num
      const add = val.isChecked ? price : 0
      return total += add
    }, 0)
    this.setState({
      total: (sum / 100).toFixed(2)
    })
  }

  // 结算
  handleSettlement = () => {
    const { list } = this.state
    const isChecked = list.some(item => item.isChecked)
    const activityId =  list[0] && list[0].activity_id
    if (!isChecked) {
      Taro.showToast({
        title: '请选择要购买的商品',
        icon: "none"
      })
    } else {
      Taro.navigateTo({
        url: `/groupBy/pages/payOrder/index?activityId=${activityId}`
      })
    }
  }

  cartNode = node => this.cartRef = node

  render () {
    const { list, failureList, isCheckAll, total } = this.state
    const isEmpty = list.length <= 0 && failureList.length <= 0
    return (
      <View className={`groupByCart ${isEmpty && 'noGood'}`}>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='list'>
          <CartList
            ref={this.cartNode}
            list={list}
            isCanReduce
            failureList={failureList}
            isCheckAll={isCheckAll}
            onRefresh={this.getCartData.bind(this)}
            onCalc={this.calcSum.bind(this)}
            onSetChekckAll={this.setCheckAll.bind(this)}
          />
        </View>
        {
          list.length > 0 && <View className='toolBar'>
            <View className='left'>
              <View
                className={`checkBox ${isCheckAll && 'isChecked'}`}
                onClick={this.setCheckAll.bind(this, isCheckAll)}
              >
                {isCheckAll && <AtIcon value='check' size='12' color='#fff'></AtIcon>}
              </View>
              全选
            </View>
            <View className='right'>
              <View className='sum'>合计: <Text className='price'>¥{ total }</Text></View>
              <View className='settlement' onClick={this.handleSettlement}>结算</View>
            </View>
          </View>          
        }
        <TabBar current={1} />
      </View>
    )
  }
}
