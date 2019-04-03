import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { withBackToTop } from '@/hocs'
import { BackToTop, Loading, NavBar, SpNote } from '@/components'
import api from '@/api'
import { formatDataTime } from '@/utils'

import './point-record.scss'

@withBackToTop
export default class PointDrawCompute extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      info: {},
      listType: '',
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const data = await api.member.pointComputeResult(this.$router.params.luckydraw_id)
    console.log(data, 81)
    this.setState({
      info: data,
    })
  }


  render () {
    const { info, showBackToTop, scrollTop } = this.state
    if(!info) {
      <Loading />
      return
    }
    console.log(info, 37)
    return (
      <View className='page-point-list'>
        <NavBar
          title='计算结果'
          leftIconType='chevron-left'
          fixed='true'
        />
        <ScrollView
          className='page-point-list__scroll compute__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
        >
          <Text className='compute-title'>截止获得时间【{formatDataTime(info.lucky_open_time * 1000)}】最后{info.last_pay_num}条全站购买时间记录</Text>
          {
            info.list
              ? info.list.map((item, index) => {
                  return (
                    <View className='point-item' key={index}>
                      <View className='point-item__cont'>
                        <Text className='point-item__desc'>{item.created}</Text>
                        <Text className='point-item__desc'>{item.created_exchange}</Text>
                        <Text className='point-item__desc'>{item.mobile}</Text>
                      </View>
                    </View>
                  )
                })
              : null
          }
          {
            !(info.list && info.list.length > 0)
            && (<SpNote img='trades_empty.png'>赶快去参与新活动吧~</SpNote>)
          }
        </ScrollView>
        <View className='compute-rule'>
          <View>取以上数值结果得：</View>
          <View>
            1. 求和：{info.alltimesum}
            <Text className='compute-rule__explain'>（上面{info.last_pay_num}条购买记录时间取值相加之和）</Text>
          </View>
          <View>
          </View>
          <View>
            2. 取余：({info.alltimesum}
            <Text className='compute-rule__explain'>（{info.last_pay_num}条时间记录之和）</Text>
            + {info.lucky_float_number}
            <Text className='compute-rule__explain'>{
              info.third_info ? `(${info.third_info.name}第${info.third_info.period}期开奖结果)` : ''
            }</Text>
            )% {info.luckydraw_store}
            <Text className='compute-rule__explain'>（本商品总参与人次）</Text>
            = {info.remainder}<Text className='compute-rule__explain'>（余数）</Text>
          </View>
          <View>3. 计算结果：{info.remainder}<Text className='compute-rule__explain'>（余数）</Text>+{info.lucky_fixed_number} = {info.lucky_code}</View>
        </View>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
