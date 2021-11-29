import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components'
import { Loading } from '@/components'
import { AtAvatar, AtButton } from 'taro-ui'
import api from '@/api'
import ComplaintRecordItem from './comps/complaint-record-item'

import './complaint-record.scss'

export default class ComplaintRecord extends Component {
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

    console.log('res', info)

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
                  Taro.navigateTo({ url: '/pages/member/complaint' })
                }}
                className='complaint-button'
                type='primary'
                size='small'
              >
                投诉
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
