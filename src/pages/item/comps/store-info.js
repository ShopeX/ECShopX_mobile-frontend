import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import S from '@/spx'
import api from '@/api'

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

  handleClickLink = () => {
    const { distributor_id } = this.props.info
    console.log(1111111, distributor_id)
    Taro.navigateTo({
      url: `/pages/store/index?id=${distributor_id}`
    })
  }

  handleStoreFav = async (id) => {
    if (!S.getAuthToken()) {
      S.toast('请先登录')

      setTimeout(() => {
        S.login(this)
      }, 2000)

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
