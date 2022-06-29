import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { SpPage, SpImage, SpButton } from '@/components'
import api from '@/api'
import { styleNames, formatDateTime, log } from '@/utils'
import './index.scss'

export default class PurchaseIndex extends Component {
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
      log.debug(`/subpages/purchase/member?code=${data.code}`)
      resolve({
        title: info.purchase_name,
        imageUrl: info.ad_pic,
        path: `/subpages/purchase/member?code=${data.code}`
      })
    })
  }

  async fetch() {
    const data = await api.purchase.purchaseInfo()
    this.setState({
      info: data
    })
  }

  showInfo() {
    const { info } = this.state
    info.surplus_share_limitnum == '0' &&
      Taro.showToast({
        title: '分享次数为0',
        icon: 'none'
      })
  }

  render() {
    const { info } = this.state

    return (
      <SpPage className='page-purchase-index'>
        <View
          className='header-block'
          style={styleNames({
            'background-image': `url(${process.env.APP_IMAGE_CDN}/m_bg.png)`
          })}
        >
          <View className='header-hd'>
            <SpImage className='usericon' src={info.avatar || 'default_user.png'} width='110' />
            <View className='header-hd__body'>
              <View className='username-wrap'>
                <View className='left-wrap'>
                  <View className='username'>{info.username}</View>
                  <View className='userRole'>
                    {
                      {
                        'dependents': '家属',
                        'employee': '员工'
                      }[info.user_type]
                    }
                  </View>
                </View>
                {info.user_type === 'employee' && (
                  <Button
                    open-type='share'
                    size='mini'
                    className='shareBtn'
                    disabled={info.surplus_share_limitnum == '0'}
                  >
                    <Text onClick={this.showInfo.bind(this)}>分享</Text>
                  </Button>
                )}
              </View>
            </View>
          </View>
          <View className="share-info">
            <View className="title">邀请码</View>
            <View className='limitnum'>{`共计：${info.dependents_limit}；已使用：${info.dependents_limit - info.surplus_share_limitnum}；可分享：${info.surplus_share_limitnum}`}</View>
          </View>
          <View className='header-bd'>
            <View className='bd-item'>
              <View className='bd-item-label'>总额度</View>
              <View className='bd-item-value'>
                {info.total_limitfee ? (info.total_limitfee / 100).toFixed(2) : '0.00'}
              </View>
            </View>
            <View className='bd-item border-item'>
              <View className='bd-item-label'>已使用额度</View>
              <View className='bd-item-value'>
                {info.used_limitfee ? (info.used_limitfee / 100).toFixed(2) : '0.00'}
              </View>
            </View>
            <View className='bd-item'>
              <View className='bd-item-label'>剩余额度</View>
              <View className='bd-item-value'>
                {info.surplus_limitfee ? (info.surplus_limitfee / 100).toFixed(2) : '0.00'}
              </View>
            </View>
          </View>
        </View>
        {info.user_type === 'employee' && (
          <View>
            <View className='line-wrap'>
              <Text className='line'></Text>
              <Text className='line-title'>全部家属</Text>
              <Text className='line'></Text>
            </View>
            {info.dependents_list && info.dependents_list.length > 0 && (
              <View className='list-wrap'>
                {info.dependents_list.map((item) => {
                  return (
                    <View className='list-item' key={item.id}>
                      <SpImage
                        className='list-item-img'
                        src={item.avatar || 'default_user.png'}
                        mode='widthFix'
                        width='750'
                        lazyLoad
                      />
                      <View className='list-item-center'>
                        <View className='list-item-name'>{item.username}</View>
                        <View className='list-item-date'>
                          {formatDateTime(item.created * 1000)}
                        </View>
                      </View>
                      <View>
                        <View>使用额度</View>
                        <View className='list-item-count'>
                          {item.used_limitfee ? (item.used_limitfee / 100).toFixed(2) : '0.00'}
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
            {info.dependents_list.length === 0 && <View className='centerText'>暂无数据</View>}
          </View>
        )}
      </SpPage>
    )
  }
}
