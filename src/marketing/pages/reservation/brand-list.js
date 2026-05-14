/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { withPager, withBackToTop } from '@/hocs'
import './brand-list.scss'

class BrandList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [
        {
          id: 1,
          name: 'Brand demo 1'
        },
        {
          id: 2,
          name: 'Brand demo 2'
        },
        {
          id: 3,
          name: 'Brand demo 3'
        }
      ]
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const { list } = this.state
    list.map((item) => {
      item.max_height = 0
    })
    this.setState({
      list: list
    })
  }

  changeIntroductionView = (id) => {
    const { list } = this.state
    list.map((item) => {
      if (item.id === id) {
        item.max_height = item.max_height === 120 ? 0 : 120
      }
    })
    this.setState({
      list: list
    })
  }

  showIntroduction = () => {}

  reservate = (e) => {
    // e.stopPropagation()
    Taro.navigateTo({
      url: '/marketing/pages/reservation/brand-detail?id=1'
    })
  }

  render() {
    const { list } = this.state
    console.log(list, 64)

    return (
      <View className='brand-list'>
        {list.map((item, index) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <View className='brand-item'>
              <View
                className='brand-item__title'
                key={`${index}1`}
                onClick={this.changeIntroductionView.bind(this, item.id)}
              >
                <Image
                  mode='widthFix'
                  src='/assets/imgs/pay_fail.png'
                  className='brand-item__title_img'
                />
              </View>
              <Text className='brand-item__btn' onClick={this.reservate.bind(this, 1)}>
                {$t('1501f117.3ed720')}
              </Text>
              <View
                className='brand-item__introduction'
                style={`max-height: ${item.max_height}px;`}
                onClick={this.showIntroduction.bind(this, index)}
              >
                {item.name}
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}

export default withPager(withBackToTop(withTranslation()(BrandList)))
