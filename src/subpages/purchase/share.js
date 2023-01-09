import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { SpPage, SpImage } from '@/components'
import api from '@/api'
import { connect } from 'react-redux'
import { withPager } from '@/hocs'
import { styleNames, formatDateTime, log } from '@/utils'
import './share.scss'

@connect(({ user, purchase }) => ({
  userInfo: user.userInfo,
  purchase_share_info: purchase.purchase_share_info
}))
@withPager
export default class PurchaseIndex extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      info: {
        invite_limit: 0,
        invited_num: 0
      },
      relative_list: []
    }
  }

  componentDidMount() {
    Taro.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.nextPage()
  }

  componentDidShow() {
    this.getActivitydata()
  }

  onShareAppMessage() {
    const { info } = this.state
    const { enterprise_id, activity_id } = this.props.purchase_share_info || {}
    return new Promise(async function (resolve) {
      const data = await api.purchase.getEmployeeInviteCode({ enterprise_id, activity_id })
      log.debug(`/pages/select-role/index?code=${data.invite_code}`)
      resolve({
        title: info.purchase_name,
        imageUrl: info.ad_pic,
        path: `/pages/select-role/index?code=${data.invite_code}`
      })
    })
  }

  async getActivitydata() {
    const { activity_id, enterprise_id } = this.props.purchase_share_info || {}
    const data = await api.purchase.getEmployeeActivitydata({ activity_id, enterprise_id })
    this.setState({
      info: data
    })
  }

  async fetch ({ pageIndex, pageSize }) {
    const { relative_list } = this.state
    const { activity_id, enterprise_id } = this.props.purchase_share_info || {}
    const { list, total_count } = await api.purchase.getEmployeeInvitelist({ activity_id, enterprise_id, page: pageIndex, pageSize })
    this.setState({
      relative_list: [...relative_list, ...list]
    })
    return { total: total_count }
  }

  showInfo() {
    const { info } = this.state
    if (info.invite_limit == info.invited_num) {
      Taro.showToast({
        title: '分享次数为0',
        icon: 'none'
      })
      return
    }
  }

  render() {
    const { info, relative_list } = this.state
    const { userInfo } = this.props

    return (
      <SpPage className='page-purchase-index'>
        <View
          className='header-block'
          style={styleNames({
            'background-image': `url(${process.env.APP_IMAGE_CDN}/m_bg.png)`
          })}
        >
          <View className='header-hd'>
            <SpImage className='usericon' src={userInfo.avatar || 'default_user.png'} width='110' />
            <View className='header-hd__body'>
              <View className='username-wrap'>
                <View className='left-wrap'>
                  <View className='username'>{userInfo.username}</View>
                  <View className='userRole'>
                    { info.is_employee == 1 ? '员工' : '家属' }
                  </View>
                </View>
                {info.is_employee == 1 && (
                  <Button
                    open-type='share'
                    size='mini'
                    className='shareBtn'
                    disabled={
                      info.invite_limit == info.invited_num
                    }
                  >
                    <Text onClick={this.showInfo.bind(this)}>分享</Text>
                  </Button>
                )}
              </View>
            </View>
          </View>
          <View className="share-info">
            <View className="title">分享额度</View>
            <View className='limitnum'>{`共计：${info.invite_limit}；已使用：${info.invited_num}；可分享：${info.invite_limit - info.invited_num}`}</View>
          </View>
          {/* <View className='header-bd'>
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
          </View> */}
        </View>
        {info.is_employee == 1 && (
          <View>
            <View className='line-wrap'>
              <Text className='line'></Text>
              <Text className='line-title'>全部家属</Text>
              <Text className='line'></Text>
            </View>
            <ScrollView
              className='line-wrap-scroll'
              scrollY
              scrollWithAnimation
              onScroll={this.handleScroll}
              onScrollToLower={this.nextPage}
            >
              <View className='list-wrap'>
                {relative_list?.map((item) => {
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
            </ScrollView>
            {relative_list.length === 0 && <View className='centerText'>暂无数据</View>}
          </View>
        )}
      </SpPage>
    )
  }
}
