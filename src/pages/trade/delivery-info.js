import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTimeline } from 'taro-ui'
import { Loading, SpCell, SpToast, Price, NavBar } from '@/components'
import { classNames, log, pickBy, formatTime, resolveOrderStatus, copyText } from '@/utils'
import api from '@/api'

import './delivery-info.scss'


export default class TradeDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: null
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
  }

  render () {
    // const { info } = this.state
    // if (!info) {
    //   return <Loading></Loading>
    // }

    // TODO: orders 多商铺

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
            items={[
              { title: '刷牙洗脸', content: ['大概8:00'], icon: 'clock' },
              { title: '吃早餐', content: ['牛奶+面包', '餐后记得吃药'], icon: 'check-circle' },
              { title: '上班', content: ['查看邮件', '写PPT', '发送PPT给领导'], icon: 'check-circle' },
              { title: '睡觉', content: ['不超过23:00'], icon: 'check-circle' }
            ]}
          >
          </AtTimeline>
        </View>
      </View>
    )
  }
}
