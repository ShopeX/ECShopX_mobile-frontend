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
      list: []
    }
  }

  componentDidMount () {
    // this.fetch()
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
    // const { list } = this.state
    // if (!list) {
    //   return <Loading></Loading>
    // }
    let lists = [
      { title: '刷牙洗脸' },
      { title: '吃早餐' },
      { title: '上班' },
      { title: '睡觉' }
    ]

    return (
      <View className='delivery-detail'>
        <NavBar
          title='物流信息'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='delivery-detail__status'>
          <Text className='delivery-detail__status-text'>物流信息</Text>
        </View>

        <View className='delivery-info'>
          {
            lists.length === 0
              ? <SpNote img='plane.png'>目前暂无物流信息~</SpNote>
              : <AtTimeline items={lists} ></AtTimeline>

          }

        </View>
      </View>
    )
  }
}
