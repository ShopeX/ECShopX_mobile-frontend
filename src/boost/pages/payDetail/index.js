/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { pickBy, formatDateTime } from '@/utils'
import api from '@/api'
import * as boostApi from '@/api/boost'
import { SpNavBar } from '@/components'
import { $t, ti } from '@/i18n'
import './index.scss'

export default class PayDetail extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      info: {},
      isLoading: false
    }
  }

  componentWillMount() {
    const { order_id } = this.$instance?.router?.params
    if (order_id) {
      this.getOrderDetail()
    } else {
      this.getOrderInfo()
    }
  }

  // 获取支付订单信息
  getOrderInfo = async () => {
    const { bargain_id } = this.$instance?.router?.params
    const { bargain_order = {} } = await boostApi.getUserBargain({
      bargain_id,
      has_order: true
    })

    this.setOrderInfo(bargain_order)
  }

  setOrderInfo = (info) => {
    this.setState({
      info: pickBy(info, {
        order_id: 'order_id',
        bargain_id: 'bargain_id',
        item_name: 'item_name',
        item_pics: 'item_pics',
        item_intro: 'item_intro',
        bargain_rules: 'bargain_rules',
        share_msg: 'share_msg',
        receiver_name: 'receiver_name',
        receiver_mobile: 'receiver_mobile',
        receiver_state: 'receiver_state',
        receiver_city: 'receiver_city',
        receiver_district: 'receiver_district',
        receiver_address: 'receiver_address',
        remark: 'remark',
        num_total: 'total_fee',
        create_time: ({ create_time }) => formatDateTime(create_time),
        total_fee: ({ total_fee }) => (total_fee / 100).toFixed(2),
        item_fee: ({ item_fee }) => (item_fee / 100).toFixed(2)
      })
    })
  }

  // 获取订单详情
  getOrderDetail = async () => {
    const { order_id, bargain_id } = this.$instance?.router?.params
    const { orderInfo } = await boostApi.getOrderDetail({
      order_id,
      bargain_id
    })

    this.setOrderInfo(orderInfo)
  }

  handlePay = async () => {
    this.setState({
      isLoading: true
    })
    const { info } = this.state
    const param = {
      pay_type: 'wxpay',
      order_id: info.order_id,
      total_fee: info.num_total
    }
    try {
      const res = await boostApi.getPayConfig(param)
      if (res.appId) {
        await Taro.requestPayment(res)
        Taro.showToast({
          title: $t('16726e8e.eb5dc9'),
          mask: true
        })
      }
    } catch (e) {
      if (!e.res) {
        let errMsg = $t('16726e8e.4548cc')
        if (e.errMsg === 'requestPayment:fail cancel') {
          errMsg = $t('46e15238.cc30f5')
        }
        Taro.showToast({
          title: errMsg,
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    }
    this.setState({
      isLoading: false
    })
  }

  render() {
    const { info, isLoading } = this.state
    const { order_id } = this.$instance?.router?.params
    return (
      <View className='payDetail'>
        <SpNavBar title={$t('5156e977.8054f7')} leftIconType='chevron-left' fixed='true' />
        <View className='address'>
          <View className='title'>{$t('b7cdc5d8.cf5122')}</View>
          <View className='info'>
            <Text>{info.receiver_name}</Text>
            <Text>{info.receiver_mobile}</Text>
          </View>
          <View className='add'>
            {info.receiver_state}
            {info.receiver_city}
            {info.receiver_district}
            {info.receiver_address}
          </View>
        </View>
        <View className='goods'>
          <Image src={info.item_pics} mode='aspectFill' className='img' />
          <View>{info.item_name}</View>
        </View>
        <View className='other'>
          <View className='line'>
            <View className='title'>{$t('b7cdc5d8.bcbf22')}</View>
            <View className='content'>
              <Text className='text'>¥{info.total_fee}</Text>
              <Text className='through'>{ti('b7cdc5d8.305e5b', [info.item_fee])}</Text>
            </View>
          </View>
          <View className='line'>
            <View className='title'>{$t('b7cdc5d8.43c297')}</View>
            <View className='content'>{info.create_time}</View>
          </View>
          <View className='line'>
            <View className='title'>{$t('b7cdc5d8.90d17e')}</View>
            <View className='content'>{info.order_id}</View>
          </View>
          <View className='line'>
            <View className='title'>{$t('b7cdc5d8.55bea7')}</View>
            <View className='content'>{info.remark || $t('b7cdc5d8.2a450f')}</View>
          </View>
        </View>
        {!order_id && (
          <Button
            className='btn'
            disabled={isLoading}
            loading={isLoading}
            onClick={this.handlePay.bind(this)}
          >
            {$t('b7cdc5d8.747349')}
          </Button>
        )}
      </View>
    )
  }
}
