/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Loading, SpNavBar } from '@/components'
import { AtAvatar, AtButton } from 'taro-ui'
import { $t } from '@/i18n'
import api from '@/api'
import ComplaintRecordItem from './comps/complaint-record-item'
import './complaint-record.scss'

class ComplaintRecord extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: null,
      list: [],
      showMap: false,
      showImage: ''
    }
  }

  componentDidMount() {
    this.getSalesperson()
    this.getComplaintsList()
  }

  /**
   * 获取个人信息
   * */
  async getSalesperson() {
    let info = await api.member.getSalesperson()

    this.setState({ info })
  }

  handleClickDisplayMap(item) {
    this.setState({
      showMap: true,
      showImage: item
    })
  }

  handleClickHideMap(e) {
    e.stopPropagation()
    this.setState({
      showMap: false
    })
  }

  /**
   * 获取个人信息
   * */
  async getComplaintsList() {
    let { list } = await api.member.getComplaintsList({ page: 1, pageSize: 100 })

    let nList = list.map((item) => {
      item.complaints_images !== ''
        ? (item.imgList = item.complaints_images.split(','))
        : (item.imgList = [])
      return item
    })

    this.setState({ list: nList })
  }

  render() {
    const { info, list, showMap, showImage } = this.state

    if (!info) return <Loading />

    return (
      <View className='page-complaint-record'>
        <SpNavBar title={$t('13af5909.c21f36')} leftIconType='chevron-left' fixed='true' />
        <View className='pege-header'>
          <View className='pege-header__avatar'>
            <AtAvatar image={info.avatar} size='normal' circle />
          </View>
          <View className='pege-header__info'>
            <View>
              <Text className='pege-header__info-name'>{info.name}</Text>
              <Text className='pege-header__info-store_name'>{info.distributor.store_name}</Text>
            </View>
            <View className='pege-header__info-store_address'>
              <Text>{info.distributor.store_address}</Text>

              <AtButton
                onClick={() => {
                  Taro.navigateTo({ url: '/marketing/pages/member/complaint' })
                }}
                className='complaint-button'
                type='primary'
                size='small'
              >
                {$t('13af5909.e19d1d')}
              </AtButton>
            </View>
          </View>
        </View>

        <View className='page-main'>
          {list.map((item) => {
            return (
              <ComplaintRecordItem
                onClick={this.handleClickDisplayMap.bind(this)}
                key={item.id}
                info={item}
              />
            )
          })}
        </View>

        {showMap ? (
          <View className='page-display'>
            <View onClick={this.handleClickHideMap.bind(this)} className='page-display__con'>
              <Image
                onClick={(e) => {
                  e.stopPropagation()
                }}
                mode='widthFix'
                src={showImage}
              />
            </View>
          </View>
        ) : null}
      </View>
    )
  }
}

export default withTranslation()(ComplaintRecord)
