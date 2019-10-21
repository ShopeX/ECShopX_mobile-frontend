import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTimeline } from 'taro-ui'
import { Loading, NavBar, SpNote } from '@/components'
import { pickBy } from '@/utils'
import api from '@/api'

import './delivery-info.scss'


export default class TradeDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: [],
      deliverycorp:'',
      deliverycode:''
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    Taro.showLoading()
    const list = await api.trade.deliveryInfo(this.$router.params.order_type, this.$router.params.order_id)
    const nList = pickBy(list,{
      title:'AcceptStation',
      content:({AcceptTime})=>[AcceptTime]

    })
    this.setState({
      list: nList,
      deliverycorp:this.$router.params.delivery_corp,
      deliverycode:this.$router.params.delivery_code
    })
    Taro.hideLoading()

  }

  render () {
    const { list, deliverycorp, deliverycode } = this.state
    if (!list) {
      return <Loading></Loading>
    }

    return (
      <View className='delivery-detail'>
        <NavBar
          title='物流信息'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='delivery-detail__status'>
          <View className='delivery-detail__status-text'>物流公司：{deliverycorp!=='undefined'&&deliverycorp!=='null'?LOGISTICS_CODE[deliverycorp]:''}</View>
           <View className='delivery-detail__status-ordertext'>物流信单号：{deliverycode!=='undefined'&&deliverycode!=='null'?deliverycode:''}</View>
          {/* <Text className='delivery-detail__status-text'>物流信息</Text> */}
        </View>

        <View className='delivery-info'>
          {
            list.length === 0
              ? <SpNote img='plane.png'>目前暂无物流信息~</SpNote>
              : <AtTimeline items={list} ></AtTimeline>

          }

        </View>
      </View>
    )
  }
}
