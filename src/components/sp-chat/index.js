import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpFloatMenuItem } from '@/components'
import { showToast, isAlipay, isWeixin, isWeb, isAPP } from '@/utils'
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
      let chat_link = ''
      if(channel == 'multi') {
        if(isWeixin) {
          chat_link = meiqia_url.wxapp
        } else if(isWeb) {
          chat_link = meiqia_url.h5
        } else if(isAPP()) {
          chat_link = meiqia_url.app
        }
      } else {
        chat_link = meiqia_url.common
      }
      if(!chat_link) {
        return
      }
      Taro.navigateTo({ url: `/pages/chat/index?url=${encodeURIComponent(chat_link)}` })
    }
  }

  return (
    <View className='sp-chat'>
      {(isWeAppKefu && isWeixin) && (
        <Button className='btn-cantact' openType='contact' sessionFrom={sessionFrom}>
          {children}
          {/* {isAlipay && <contact-button
            tnt-inst-id="JRC_1NRG"
            scene="SCE01214288"
          >
          </contact-button>} */}
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
