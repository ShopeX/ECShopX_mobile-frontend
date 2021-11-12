import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { SpCell } from '@/components'
import api from '@/api'
import { pickBy, classNames } from '@/utils'

import './brand-result.scss'

@withPager
@withBackToTop
export default class BrandResult extends Component {
  constructor (props) {
    super(props)

    this.state = {
      brand_store: '',
      brand_time: ''
    }
  }

  componentDidMount () {}

  async fetch () {}

  handleClickRecord = () => {
    Taro.navigateTo({
      url: '/marketing/pages/reservation/reservation-list'
    })
  }

  render () {
    const { brand_store, brand_time } = this.state

    return (
      <View className='brand-result'>
        <View className='brand-result__title'>
          <Image
            mode='widthFix'
            className='brand-result__title_img'
            src='/assets/imgs/pay_fail.png'
          ></Image>
          <Text className='brand-result__title_status'>预约成功</Text>
          <Text className='brand-result__title_tip'>到店出示二维码即可享受服务</Text>
        </View>
        <View className='brand-result__info'>
          <SpCell title='预约门店' isLink value={brand_store}></SpCell>
          <SpCell title='预约时间' value={brand_time}></SpCell>
        </View>
        <View className='brand-result__btn' onClick={this.handleClickRecord.bind(this)}>
          我的预约记录
        </View>
        <View className='brand-result__btn cancel_btn'>取消预约</View>
      </View>
    )
  }
}
