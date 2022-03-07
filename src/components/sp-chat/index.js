import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpFloatMenuItem } from '@/components'
import { showToast } from '@/utils'
import './index.scss'

const initialState = {
  isWeAppKefu: true
}

function SpChat (props) {
  const { children, sessionFrom = '' } = props
  const [state, setState] = useImmer(initialState)
  const { isWeAppKefu } = state
  const { echat, meiqia } = useSelector((state) => state.sys)

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    if (echat?.is_open == 'true' || meiqia?.is_open == 'true') {
      setState((draft) => {
        draft.isWeAppKefu = false
      })
    }
  }

  const handleKeFu = () => {
    if (echat?.is_open == 'true') {
      if (!echat.echat_url) {
        showToast('请配置一洽客服链接')
      } else {
        Taro.navigateTo({ url: `/pages/chat/index?url=${encodeURIComponent(echat.echat_url)}` })
      }
    } else if (meiqia?.is_open == 'true') {
      // Taro.navigateTo({ url: `/pages/chat/index?url=${encodeURIComponent(echat.echat_url)}` })
    }
  }

  return (
    <View className='sp-chat'>
      {isWeAppKefu && (
        <Button className='btn-cantact' openType='contact' sessionFrom={sessionFrom}>
          {children}
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
