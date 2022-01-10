import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import S from '@/spx'
import api from '@/api'
import { merchantIsvaild, showToast } from '@/utils'

import './store-info.scss'

export default class StoreInfo extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)

    this.state = {
      isFav: false
    }
  }

  componentDidMount () {
    if (!S.getAuthToken()) {
      return
    }

    const { info } = this.props
    api.member.storeIsFav(info.distributor_id).then((res) => {
      if (res.is_fav) {
        this.setState({
          isFav: true
        })
      }
    })
  }

  handleClickLink = async () => {
    const { distributor_id } = this.props.info || {}
    let isVaild = await merchantIsvaild({ distributor_id }) // 判断当前店铺关联商户是否被禁用
    if (!isVaild) {
      showToast('该店铺已注销，在别的店铺看看吧')
      return
    }
    Taro.navigateTo({
      url: `/pages/store/index?id=${distributor_id}`
    })
  }

  handleStoreFav = async (id) => {
    const { distributor_id } = this.props.info || {}
    if (!S.getAuthToken()) {
      S.toast('请先登录')

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    let isVaild = await merchantIsvaild({ distributor_id }) // 判断当前店铺关联商户是否被禁用
    if (!isVaild) {
      showToast('该店铺已注销，在别的店铺看看吧')
      return
    }

    const { isFav } = this.state
    if (isFav) return

    const { fav_id } = await api.member.storeFav(id)
    if (fav_id) {
      this.setState({
        isFav: true
      })
    }
  }

  render () {
    const { info } = this.props
    const { isFav } = this.state

    if (!info) {
      return null
    }

    return (
      <View className='store-info'>
        <View className='view-flex view-flex-middle'>
          <Image
            className='store-brand'
            src={info.logo || 'https://fakeimg.pl/120x120/EFEFEF/CCC/?text=brand&font=lobster'}
            mode='aspectFit'
          />
          <View>
            <View className='store-name'>{info.name}</View>
          </View>
        </View>
        <View className='view-flex'>
          <View className='view-flex-item'>
            <View
              className='store-attention-btn'
              onClick={this.handleStoreFav.bind(this, info.distributor_id)}
            >
              {isFav ? '已关注' : '关注店铺'}
            </View>
          </View>
          <View className='view-flex-item'>
            <View className='store-enter-btn' onClick={this.handleClickLink}>
              进入店铺
            </View>
          </View>
        </View>
      </View>
    )
  }
}
