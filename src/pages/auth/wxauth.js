import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'

export default class WxAuth extends Component {
  async fetchUserInfo (iv, encryptedData) {
    const { code } = await Taro.login()
    const { session_key: sessionKey, openid } = await api.wx.code(code)

    const info = await api.wx.info({ iv, encryptedData, sessionKey  })
    return info
  }

  handleGetUserInfo = (res) => {
    const { iv, encryptedData, userInfo } = res.detail

    if (!iv || !encryptedData) {
      Taro.showModal({
        title: '授权提示',
        content: `${TARO_APP.APP_NAME}需要您的授权才能正常运行`,
        showCancel: false,
        confirmText: '知道啦'
      })

      return
    }

    log.debug(`[authorize] userInfo:`, userInfo)
    Taro.showLoading({
      mask: true,
      title: '正在加载...'
    })

    let err = null
    try {
      const info = await this.fetchUserInfo(iv, encryptedData)
      // TODO: auth
    }
  }

  render () {
    return (
      <View className='page-wxauth'>
        <AtButton
          type='primary'
          openType='getUserInfo'
          onGetUserInfo={this.handleGetUserInfo}
        >授权</AtButton>
      </View>
    )
  }
}
