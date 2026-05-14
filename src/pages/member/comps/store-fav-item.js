/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import api from '@/api'
import { $t, ti } from '@/i18n'

import './store-fav-item.scss'

class StoreFavItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  handleFavRemove = async (id) => {
    const { confirm } = await Taro.showModal({
      title: $t('8371caa0.02d981'),
      content: $t('8371caa0.3a431c'),
      confirmColor: '#0b4137',
      confirmText: $t('8371caa0.e83a25'),
      cancelText: $t('8371caa0.625fb2')
    })
    if (!confirm) return
    const { status } = await api.member.storeFavDel(id)
    if (status) {
      console.log(this.props)
      this.props.onCancel()
    }
  }

  render() {
    const { info, onClick } = this.props

    return (
      <View className='fav-store__item'>
        <View className='fav-store__item-flex' onClick={onClick}>
          <Image className='fav-store__item-brand' src={info.logo} mode='aspectFill' />
          <View className='fav-store__item-info'>
            <View className='store-name'>{info.name}</View>
            <View className='store-fav-count'>{ti('8371caa0.8ef422', [info.fav_num])}</View>
          </View>
        </View>
        <View
          className='fav-store__item-cancel'
          onClick={this.handleFavRemove.bind(this, info.distributor_id)}
        >
          {$t('8371caa0.92bdc8')}
        </View>
      </View>
    )
  }
}

export default withTranslation()(StoreFavItem)
