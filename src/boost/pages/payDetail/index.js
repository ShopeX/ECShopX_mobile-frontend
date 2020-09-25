/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 结算详情页面
 * @FilePath: /unite-vshop/src/boost/pages/payDetail/index.js
 * @Date: 2020-09-23 16:49:53
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-25 15:16:10
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { pickBy, formatDataTime } from '@/utils'
import api from '@/api'
import { NavBar } from '@/components'

import './index.scss'
import { findLast } from 'lodash'

export default class PayDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      isLoading: false
    }
  }

  componentWillMount () {
    this.getOrderInfo()
  }


  config = {
    navigationBarTitleText: '结算页面'
  }
  
  // 获取订单信息
  getOrderInfo = async () => {
    const { bargain_id } = this.$router.params
    const {
      bargain_order = {}
    } = await api.boost.getUserBargain({
      bargain_id,
      has_order: true
    })
    
    this.setState({
      info: pickBy(bargain_order, {
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
        create_time: ({ create_time }) => formatDataTime(create_time),
        total_fee: ({ total_fee }) => (total_fee / 100).toFixed(2),
        item_fee: ({ item_fee }) => (item_fee / 100).toFixed(2)
      })
    })
  }  

  handlePay = async () => {
    this.setState({
      isLoading: true
    })
    const { info } = this.state
    const param = {
      pay_type: 'wxpay1111',
      order_id: info.order_id,
      total_fee: info.num_total
    }
    try {
      const res = await api.boost.getPayConfig(param)
      if (res.appId) {
        await Taro.requestPayment(res)
        Taro.showToast({
          title: '支付成功',
          mask: true
        })        
      }
    } catch (e) {
      if (!e.res) {
        let errMsg = '支付失败'
        if (e.errMsg === 'requestPayment:fail cancel') {
          errMsg = '取消支付'
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
  
  render () {
    const { info, isLoading } = this.state
    return (
      <View className='payDetail'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='address'>
          <View className='title'>收货信息</View>
          <View className='info'>
            <Text>
              { info.receiver_name }
            </Text>
            <Text>
              { info.receiver_mobile }
            </Text>
          </View>
          <View className='add'>
            { info.receiver_state}{ info.receiver_city }{ info.receiver_district }
            { info.receiver_address }
          </View>
        </View>
        <View className='goods'>
          <Image src={info.item_pics} mode='aspectFill' className='img' />
          <View>{ info.item_name }</View>
        </View>
        <View className='other'>
          <View className='line'>
            <View className='title'>支付金额:</View>
            <View className='content'>
              <Text className='text'>¥{ info.total_fee }</Text>
              <Text className='through'>原价 ¥{ info.item_fee }</Text>
            </View>
          </View>
          <View className='line'>
            <View className='title'>下单时间:</View>
            <View className='content'>{ info.create_time }</View>
          </View>
          <View className='line'>
            <View className='title'>订单编号:</View>
            <View className='content'>{ info.order_id }</View>
          </View>
          <View className='line'>
            <View className='title'>备注:</View>
            <View className='content'>{ info.remark }</View>
          </View>
        </View>
        <Button className='btn' disabled={isLoading} loading={isLoading} onClick={this.handlePay.bind(this)}>立即支付</Button>
      </View>
    )
  }  
}