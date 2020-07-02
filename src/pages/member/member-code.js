import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { withLogin } from '@/hocs'
import api from '@/api'

import './member-code.scss'

@withLogin()
export default class MemberCode extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: null
    }
  }

  componentDidMount () {
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
        userCardCode: memberInfo.user_card_code,
        vipType: vipgrade.is_vip && vipgrade.vip_type
      }
    })
  }

  render () {
    const { username, avatar } = Taro.getStorageSync('userinfo')
    const { info } = this.state

    return (
      <View className="member-code-wrap">
        <View className="member-code">
          <View className="avatar">
            <Image className="avatar-img" src={avatar} mode="aspectFill" />
            {/* {
              info.vipType && (info.vipType === 'vip' || info.vipType === 'svip')
                && <Image className="icon-vip" src="../images/svip.png" />
            } */}
          </View>
          <View className="nickname">{username}</View>
          <Image className="member-code-bar" mode="aspectFill" src={info.barcode_url} />
          <Image className="member-code-qr" mode="aspectFit" src={info.qrcode_url} />
          <View>{info.userCardCode}</View>
          <View className="muted">使用时，出示此码</View>
        </View>
      </View>
    )
  }
}
