/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 购物车goodItem
 * @FilePath: /unite-vshop/src/groupBy/component/cartList/index.js
 * @Date: 2020-04-30 18:43:03
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-22 14:31:25
 */
import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components'
import { AtSwipeAction } from 'taro-ui'
import api from '@/api'
import GoodItem from '../goodItem'

import './index.scss'

export default class cartList extends Component {
  static defaultProps = {
    list: [],
    // 失效商品
    failureList: [],
    isCanReduce: false
  }

  constructor(props) {
    super(props)
    const list = props.list.map((item) => {
      item.isOpened = false
      return item
    })
    this.state = {
      goodList: list,
      isRefresh: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const list = nextProps.list.map((item) => {
      item.isOpened = false
      return item
    })
    this.setState({
      goodList: list
    })
  }

  // 只展示一个滑动
  handleSingle = (index, isClose = false) => {
    let { goodList } = this.state
    if (isClose) {
      goodList[index].isOpened = false
    } else {
      for (let i = 0; i < goodList.length; i++) {
        if (i === index) {
          goodList[i].isOpened = true
        } else {
          goodList[i].isOpened = false
        }
      }
    }
    this.setState({
      goodList
    })
  }

  // 修改商品数量
  setGoodNum = (cartId, type) => {
    const { goodList } = this.state
    const index = goodList.findIndex((item) => item.cartId === cartId)
    const num = goodList[index].num
    if (type === 'add') {
      goodList[index].num = num ? num + 1 : 1
      goodList[index].isChecked = true
    } else {
      if (num && num > 1) {
        goodList[index].num = num - 1
      }
    }
    api.groupBy
      .updateGoodNum({
        cart_id: goodList[index].cartId,
        num: goodList[index].num
      })
      .then(() => {
        this.setState(
          {
            goodList
          },
          () => {
            const isCheckAll = goodList.some((item) => !item.isChecked)
            this.props.onSetChekckAll && this.props.onSetChekckAll(!isCheckAll, false)
          }
        )
      })
  }

  // 修改选中状态
  setCheck = (cartId) => {
    const { goodList } = this.state
    const index = goodList.findIndex((item) => item.cartId === cartId)
    const { isChecked = false } = goodList[index]
    goodList[index].isChecked = !isChecked
    api.groupBy
      .updateCheckGood({
        cart_id: cartId,
        is_checked: !isChecked
      })
      .then(() => {
        // 是否全选
        const isCheckAll = goodList.some((item) => !item.isChecked)
        this.props.onSetChekckAll && this.props.onSetChekckAll(!isCheckAll, false)
        this.setState({
          goodList
        })
      })
  }

  // 全选
  setCheckAll = (isChecked) => {
    const { goodList } = this.state
    const checkId = goodList.map((item) => {
      item.isChecked = isChecked
      return item.cartId
    })
    Taro.showLoading({
      title: '请稍等',
      mask: true
    })
    api.groupBy
      .updateCheckGood({
        cart_id: checkId,
        is_checked: isChecked
      })
      .then(() => {
        Taro.hideLoading()
        this.props.onSetChekckAll && this.props.onSetChekckAll(isChecked, true)
        this.setState({
          goodList
        })
      })
  }

  // 删除
  handleDelete = (cartId) => {
    Taro.showModal({
      content: '确认删除该商品?',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '删除中...' })
          api.groupBy.deleteGood({ cart_id: cartId }).then((result) => {
            Taro.hideLoading()
            console.log(result)
            Taro.showToast({
              title: '删除成功',
              complete: () => {
                this.handleRefresh()
              }
            })
          })
        }
      }
    })
  }

  // 清空失效
  clearCart = () => {
    const { failureList } = this.props
    const ids = failureList.map((item) => item.cartId)
    Taro.showModal({
      content: '确认清空失效商品?',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '清空中...' })
          api.groupBy.deleteGood({ cart_id: ids }).then((result) => {
            Taro.hideLoading()
            console.log(result)
            Taro.showToast({
              title: '清空成功',
              complete: () => {
                this.handleRefresh()
              }
            })
          })
        }
      }
    })
  }

  // 下拉刷新
  handleRefresh = () => {
    this.setState({
      isRefresh: true
    })

    this.props.onRefresh &&
      this.props.onRefresh(() => {
        this.setState({
          isRefresh: false
        })
      })
  }

  render() {
    const options = [
      {
        text: '删除',
        style: {
          backgroundColor: '#FF4949'
        }
      }
    ]
    const { goodList, isRefresh } = this.state

    const { failureList, isCanReduce } = this.props

    return (
      <View className='cartList'>
        <ScrollView
          className='list'
          scrollY
          scroll-anchoring
          refresherEnabled
          scrollWithAnimation
          refresherTriggered={isRefresh}
          onRefresherRefresh={this.handleRefresh}
        >
          {goodList.map((item, index) => (
            <AtSwipeAction
              options={options}
              autoClose
              key={item.itemId}
              isOpened={item.isOpened}
              onOpened={this.handleSingle.bind(this, index, false)}
              onClosed={this.handleSingle.bind(this, index, true)}
              onClick={this.handleDelete.bind(this, item.cartId)}
            >
              <GoodItem
                ShowCheckBox
                isCanReduce={isCanReduce}
                goodInfo={item}
                onSetGoodNum={this.setGoodNum.bind(this)}
                onCheckItem={this.setCheck.bind(this)}
              />
            </AtSwipeAction>
          ))}
          {failureList.length > 0 && (
            <View className='failure'>
              <View className='failureTitle'>
                <View>失效商品</View>
                <View onClick={this.clearCart.bind(this)}>清空</View>
              </View>
              <View className='failureList'>
                {failureList.map((item) => (
                  <GoodItem key={item.itemId} isExpired goodInfo={item} />
                ))}
              </View>
            </View>
          )}
          {goodList.length <= 0 && failureList.length <= 0 && (
            <View className='empty'>暂无数据</View>
          )}
        </ScrollView>
      </View>
    )
  }
}
