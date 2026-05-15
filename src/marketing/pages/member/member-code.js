/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { SpNavBar, SpPage } from '@/components'
import userIcon from '@/assets/imgs/user-icon.png'
import api from '@/api'
import './member-code.scss'

class MemberCode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: null
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('8978f7db.b41508') })
  }

  async fetch() {
    const { memberInfo, vipgrade, cardInfo } = await api.member.memberInfo()
    const params = {
      code_type: (cardInfo && cardInfo.code_type) || {},
      content: memberInfo.user_card_code
    }
    const res = await api.member.memberCode(params)

    this.setState({
      info: {
        ...res,
        memberInfo: memberInfo,
        userCardCode: memberInfo.user_card_code,
        vipType: vipgrade.is_vip && vipgrade.vip_type
      }
    })
  }

  render() {
    const { info } = this.state
    if (!info) {
      return null
    }

    const { username, avatar } = info.memberInfo

    return (
      <SpPage>
        <View className='member-code-wrap'>
          <SpNavBar title={$t('c63b7c0f.4a86cd')} leftIconType='chevron-left' />
          <View className='member-code'>
            <View className='avatar'>
              <Image className='avatar-img' src={avatar || userIcon} mode='aspectFill' />
            </View>
            <View className='nickname'>{username}</View>
            <Image className='member-code-bar' mode='aspectFill' src={info.barcode_url} />
            <Image className='member-code-qr' mode='aspectFit' src={info.qrcode_url} />
            <View>{info.userCardCode}</View>
            <View className='muted'>{$t('8978f7db.42a49a')}</View>
          </View>
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(MemberCode)
