import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { Loading } from '@/components'
import { normalizeQuerys } from '@/utils'

import './shopping-guide-card.scss'

export default class ShoppingGuideCard extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      info: null,
      token: ''
    }
  }

  async componentWillMount () {
    Taro.setNavigationBarTitle({
      title: '导购名片'
    })

    let token = S.getAuthToken()

    this.setState({
      token
    })

    let { smid, dtid } = await normalizeQuerys(this.$instance.router.params)

    if (smid) {
      Taro.setStorageSync('s_smid', smid)
    }
    if (dtid) {
      Taro.setStorageSync('s_dtid', dtid)
    }
  }

  componentDidMount () {
    let token = S.getAuthToken()

    this.fetch(token)
    if (!token) return

    this.getShop()
  }

  async fetch (token) {
    let salesperson_id = Taro.getStorageSync('s_smid')

    let info = null

    if (token) {
      info = await api.member.getUsersalespersonrel({
        salesperson_id
      })
    } else {
      info = await api.member.getSalespersonNologin({
        salesperson_id
      })
    }

    if (info) {
      Taro.setStorageSync('distribution_shop_id', info.user_id)
    }
    this.setState({
      info
    })
  }

  /**
   * 获取店铺
   * */
  async getShop () {
    let distributor_id = Taro.getStorageSync('s_dtid')

    let store = await api.shop.getShop({ distributor_id })

    Taro.setStorageSync('curStore', store)
  }

  /**
   * 绑定好友
   * */
  handleClickBindFriend () {}

  /**
   * 绑定导购
   * */
  async handleClickBindShoppingGuide () {
    Taro.showLoading({
      title: '绑定中',
      mask: true
    })

    let data = null
    try {
      let salesperson_id = Taro.getStorageSync('s_smid')

      data = await api.member.setUsersalespersonrel({
        salesperson_id
      })
    } catch (err) {
      Taro.hideLoading()

      Taro.showToast({
        title: '绑定失败',
        icon: 'none',
        duration: 2000
      })
    }

    Taro.hideLoading()

    if (!data) return

    let { info } = this.state

    this.setState(
      {
        info: Object.assign({}, info, { is_bind: data.success })
      },
      () => {
        if (data.success) {
          Taro.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          Taro.showToast({
            title: '绑定失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    )
  }

  handleClickIndex () {
    Taro.redirectTo({
      url: '/pages/index'
    })
  }

  /**
   * 监听按钮点击事件执行开始时的回调
   * */
  handleClickStartmessage (e) {
    console.log('监听按钮点击事件执行开始时的回调', e)
  }

  /**
   * 监听按钮点击事件执行完毕后的回调
   * */
  handleClickCompletemessage (e) {
    console.log('监听按钮点击事件执行完毕后的回调', e)
    // Taro.showToast({
    //   title: '以通过微信服务通知',
    //   icon: 'none',
    //   duration: 3000
    // })
  }

  handleClickTo () {
    Taro.setStorageSync('isShoppingGuideCard', 'true')

    Taro.redirectTo({
      url: '/subpage/pages/auth/wxauth'
    })
  }

  config = {
    // 定义需要引入的第三方组件
    usingComponents: {
      'cell': 'plugin://contactPlugin/cell'
    }
  }

  render () {
    const { info, token } = this.state

    if (!info) {
      return <Loading />
    }

    return (
      <View className='shopping-guide-card'>
        <View className='page-header flex'>
          <View className='page-header__info'>
            <View className='page-header__info-name'>
              {info.name} <Text>导购</Text>
            </View>
            <View className='page-header__info-shop'>{info.store_name}</View>
            {/* <View className='page-header__info-address'>
              地址
            </View> */}
          </View>
          <View>
            <AtAvatar circle size='large' image={info.avatar}></AtAvatar>
          </View>
        </View>

        <View className='page-button'>
          {!token ? (
            <AtButton onClick={this.handleClickTo.bind(this)}>去授权</AtButton>
          ) : info.is_friend == 0 ? (
            <AtButton className='page-button__button'>
              <View className='page-cell'>
                <Text className='button-text'>加好友</Text>
                <cell
                  onStartmessage={this.handleClickStartmessage.bind(this)}
                  onCompletemessage={this.handleClickCompletemessage.bind(this)}
                  plugid={info.work_configid}
                />
              </View>
            </AtButton>
          ) : null}
          {info.is_bind == 0 ? (
            <AtButton onClick={this.handleClickBindShoppingGuide.bind(this)}>绑定导购</AtButton>
          ) : null}
          <AtButton onClick={this.handleClickIndex.bind(this)}>去购物</AtButton>
        </View>
      </View>
    )
  }
}
