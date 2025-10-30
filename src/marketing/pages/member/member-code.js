// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { SpNavBar, SpPage } from '@/components'
import { withLogin } from '@/hocs'
import userIcon from '@/assets/imgs/user-icon.png'
import api from '@/api'

import './member-code.scss'

export default class MemberCode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: null
    }
  }

  componentDidMount() {
    this.fetch()
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
          <SpNavBar title='我的二维码' leftIconType='chevron-left' />
          <View className='member-code'>
            <View className='avatar'>
              <Image className='avatar-img' src={avatar || userIcon} mode='aspectFill' />
            </View>
            <View className='nickname'>{username}</View>
            <Image className='member-code-bar' mode='aspectFill' src={info.barcode_url} />
            <Image className='member-code-qr' mode='aspectFit' src={info.qrcode_url} />
            <View>{info.userCardCode}</View>
            <View className='muted'>使用时，出示此码</View>
          </View>
        </View>
      </SpPage>
    )
  }
}
