import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTimeline } from 'taro-ui'
import { Loading, NavBar } from '@/components'
import { pickBy } from '@/utils'
import api from '@/api'

import './delivery-info.scss'


export default class TradeDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: []
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    Taro.showLoading()
    const list = await api.trade.deliveryInfo(this.$router.params.order_id)
    const nList = pickBy(list,{
      title: 'opeTime',
      content: ({ opeRemark, opeTitle }) => [opeTitle, opeRemark]
    })
    this.setState({
      list: nList
    })
    Taro.hideLoading()
  }

  render () {
    const { list } = this.state
    if (!list) {
      return <Loading></Loading>
    }

    return (
      <View className='trade-detail'>
        <NavBar
          title='物流信息'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='trade-detail__status'>
          <Text className='trade-detail__status-text'>物流信息</Text>
          <Image
            mode='aspectFill'
            className='trade-detail__status-ico'
            src='/assets/imgs/trade/ico_wait_buyer_confirm_goods.png'
          />
        </View>

        <View className='delivery-info'>
          <AtTimeline
            items={list}
          >
          </AtTimeline>
        </View>
      </View>
    )
  }
}
