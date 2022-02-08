import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { SpPage, SpImage, SpButton } from '@/components'
import api from '@/api'
import { styleNames, formatDateTime } from '@/utils'
import './purchase.scss'

export default class myGroupList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      info: {},
      code: ''
    }
  }

  componentDidShow() {
    this.fetch()
  }


  onShareAppMessage() {
    const { info } = this.state
    return new Promise(async function (resolve) {
      const data = await api.purchase.purchaseCode()
      resolve({
        title: info.purchase_name,
        imageUrl: info.ad_pic,
        path: `/subpages/member/index?code=${data.code}`
      })
    })

  }

  async fetch() {
    const data = await api.purchase.purchaseInfo()
    this.setState({
      info: data
    })
  }

  render() {
    const { info } = this.state

    return (
      <SpPage className='pages-purchase-index'>
        <View
          className='header-block'
          style={styleNames({
            'background-image': `url(${process.env.APP_IMAGE_CDN}/m_bg.png)`
          })}
        >
          <View className='header-hd'>
            <SpImage
              className='usericon'
              src={info.avatar || 'default_user.png'}
              width='110'
            />
            <View className='header-hd__body'>
              <View className='username-wrap'>
                <View className='left-wrap'>
                  <View className='username'>
                    {info.username}
                  </View>
                  <View className='userRole'>{info.user_type === 'dependents' ? '家属' : '员工'}</View>
                </View>
                {info.user_type === 'employee' && <Button open-type='share' size='mini' className='shareBtn' disabled={info.surplus_share_limitnum == '0'}>
                  分享
                </Button>}
              </View>
            </View>
          </View>
          <View className='header-bd'>
            <View
              className='bd-item'
            >
              <View className='bd-item-label'>总额度</View>
              <View className='bd-item-value'>{info.total_limitfee}</View>
            </View>
            <View className='bd-item border-item'>
              <View className='bd-item-label'>已使用额度</View>
              <View className='bd-item-value'>{info.used_limitfee}</View>
            </View>
            <View className='bd-item'>
              <View className='bd-item-label'>剩余额度</View>
              <View className='bd-item-value'>{info.surplus_limitfee}</View>
            </View>
          </View>
        </View>
        {info.user_type === 'employee' && <View>
          <View className='line-wrap'>
            <Text className='line'></Text>
            <Text className='line-title'>全部家属</Text>
            <Text className='line'></Text>
          </View>
          {info.dependents_list && info.dependents_list.length > 0 && <View className='list-wrap'>
            {info.dependents_list.map((item) => {
              return (<View className='list-item' key={item.id}>
                <SpImage
                  className='list-item-img'
                  src={item.avatar || 'default_user.png'}
                  mode='widthFix'
                  width='750'
                  lazyLoad
                />
                <View className='list-item-center'>
                  <View className='list-item-name'>{item.username}</View>
                  <View className='list-item-date'>{formatDateTime(item.created * 1000)}</View>
                </View>
                <View>
                  <View>使用额度</View>
                  <View className='list-item-count'>{item.used_limitfee}</View>
                </View>
              </View>)
            })}
          </View>}
          {info.dependents_list.length === 0 && <View className='centerText'>暂无数据</View>}
        </View>}

      </SpPage>
    )
  }
}
