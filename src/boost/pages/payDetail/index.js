import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { pickBy, formatDataTime } from '@/utils'
import api from '@/api'
import { SpNavBar } from '@/components'

import './index.scss'

export default class PayDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      isLoading: false
    }
  }

  componentWillMount () {
    const { order_id } = this.$router.params
    if (order_id) {
      this.getOrderDetail()
    } else {
      this.getOrderInfo()
    }
  }

  config = {
    navigationBarTitleText: '订单详情'
  }

  // 获取支付订单信息
  getOrderInfo = async () => {
    const { bargain_id } = this.$router.params
    const { bargain_order = {} } = await api.boost.getUserBargain({
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
        create_time: ({ create_time }) => formatDataTime(create_time),
        total_fee: ({ total_fee }) => (total_fee / 100).toFixed(2),
        item_fee: ({ item_fee }) => (item_fee / 100).toFixed(2)
      })
    })
  }

  // 获取订单详情
  getOrderDetail = async () => {
    const { order_id, bargain_id } = this.$router.params
    const { orderInfo } = await api.boost.getOrderDetail({
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
    const { order_id } = this.$router.params
    return (
      <View className='payDetail'>
        <SpNavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='address'>
          <View className='title'>收货信息</View>
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
            <View className='title'>支付金额:</View>
            <View className='content'>
              <Text className='text'>¥{info.total_fee}</Text>
              <Text className='through'>原价 ¥{info.item_fee}</Text>
            </View>
          </View>
          <View className='line'>
            <View className='title'>下单时间:</View>
            <View className='content'>{info.create_time}</View>
          </View>
          <View className='line'>
            <View className='title'>订单编号:</View>
            <View className='content'>{info.order_id}</View>
          </View>
          <View className='line'>
            <View className='title'>备注:</View>
            <View className='content'>{info.remark || '暂无备注'}</View>
          </View>
        </View>
        {!order_id && (
          <Button
            className='btn'
            disabled={isLoading}
            loading={isLoading}
            onClick={this.handlePay.bind(this)}
          >
            立即支付
          </Button>
        )}
      </View>
    )
  }
}
