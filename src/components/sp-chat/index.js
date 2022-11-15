import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpFloatMenuItem } from '@/components'
import { showToast, isAlipay } from '@/utils'
import api from '@/api'

import './index.scss'

const initialState = {
  isWeAppKefu: true
}

function SpChat(props) {
  const { children, sessionFrom = '' } = props
  const [state, setState] = useImmer(initialState)
  const { isWeAppKefu } = state
  const { echat, meiqia } = useSelector((state) => state.sys)
  const $instance = getCurrentInstance()

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    if (echat?.is_open == 'true' || meiqia?.is_open) {
      setState((draft) => {
        draft.isWeAppKefu = false
      })
    }
  }

  const handleKeFu = async () => {
    if (echat?.is_open == 'true') {
      if (!echat.echat_url) {
        showToast('请配置一洽客服链接')
      } else {
        Taro.navigateTo({ url: `/pages/chat/index?url=${encodeURIComponent(echat.echat_url)}` })
      }
    } else if (meiqia?.is_open) {
      // 获取店铺美洽配置
      const { dtid } = $instance.router.params
      const meiqiaConfig = await api.im.getImConfigByDistributor(dtid)
      const { channel, meiqia_url } = meiqiaConfig
      const chat_link = channel == 'multi' ? meiqia_url.wxapp : meiqia_url.common
      Taro.navigateTo({ url: `/pages/chat/index?url=${encodeURIComponent(chat_link)}` })
    }
  }

  return (
    <View className='sp-chat'>
      {(isWeAppKefu && !isAlipay) && (
        <Button className='btn-cantact' openType='contact' sessionFrom={sessionFrom}>
          {children}
          {isAlipay && <contact-button
            tnt-inst-id="JRC_1NRG"
            scene="SCE01214288"
          >
          </contact-button>}
        </Button>
      )}
      {!isWeAppKefu && (
        <View className='' onClick={handleKeFu}>
          {children}
        </View>
      )}
    </View>
  )
}

SpChat.options = {
  addGlobalClass: true
}

export default SpChat
