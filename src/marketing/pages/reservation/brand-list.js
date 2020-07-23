/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/marketing/pages/reservation/brand-list.js
 * @Date: 2020-04-30 17:12:45
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-21 11:34:44
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { BackToTop, Loading, TagsBar, FilterBar, SearchBar, GoodsItem, NavBar, SpNote } from '@/components'
import api from '@/api'
import { pickBy, classNames } from '@/utils'

import './brand-list.scss'

@withPager
@withBackToTop
export default class BrandList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: [{
        id: 1,
        name: '讽德诵功的国际化刚刚好复健科低功耗的看过的看过后的看法更好地将更好地积分开个会12',
      },{
        id: 2,
        name: '讽德诵功的国际化刚刚好复健科低功耗的看过的看过后的看法更好地将更好地积分开个会123',
      },{
        id: 3,
        name: '讽德诵功的国际化刚刚好复健科低功耗的看过的看过后的看法更好地将更好地积分开个会213',
      }]
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { list } = this.state
    list.map(item => {
      item.max_height = 0
    })
    this.setState({
      list: list
    })
  }
 
  changeIntroductionView = (id) => {
    const { list } = this.state
    list.map(item => {
      if(item.id === id) {
        item.max_height = item.max_height === 120 ? 0 : 120
      }
    })
    this.setState({
      list: list
    })
  }

  reservate = (e) => {
    // e.stopPropagation()
    Taro.navigateTo({
      url: '/marketing/pages/reservation/brand-detail?id=1'
    })
  }
  
  render () {
    const { list } = this.state
    console.log(list, 64)

    return (
      <View className='brand-list'>
        {
          list.map((item, index) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <View className='brand-item'>
                <View className='brand-item__title' key={`${index}1`} onClick={this.changeIntroductionView.bind(this, item.id)}>
                  <Image mode='widthFix' src='/assets/imgs/pay_fail.png' className='brand-item__title_img' />
                </View>
                <Text className='brand-item__btn' onClick={this.reservate.bind(this, 1)}>立即预约</Text>
                <View 
                  className='brand-item__introduction'
                  style={`max-height: ${item.max_height}px;`} 
                  onClick={this.showIntroduction.bind(this, index)}
                >{item.name}</View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
