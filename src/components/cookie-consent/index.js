import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { SpHtml } from '@/components'
import api from '@/api'
import './index.scss'

const CookieConsent = () => {
  const [visible, setVisible] = useState(false)
  const [animationVisible, setAnimationVisible] = useState(false)
  const [policyData, setPolicyData] = useState('')

  useEffect(() => {
    // 仅在 H5 环境下执行
    if (process.env.TARO_ENV === 'h5') {
      const consent = Taro.getStorageSync('cookie_consent')
      if (!consent) {
        fetchCookiePolicy()
      }
    }
  }, [])

  const fetchCookiePolicy = async () => {
    try {
      const { content } = await api.shop.getRuleInfo({
        type: 'cookie_privacy'
      })
      if (content) {
        setPolicyData(content)
        setVisible(true)
        // 延迟设置动画状态以触发 CSS transition
        setTimeout(() => {
          setAnimationVisible(true)
        }, 50)
      }
    } catch (error) {
      console.error('Failed to fetch cookie policy:', error)
    }
  }

  const handleClose = (type) => {
    // 开始离开动画
    setAnimationVisible(false)
    // 等待动画结束后卸载组件
    setTimeout(() => {
      Taro.setStorageSync('cookie_consent', type)
      setVisible(false)
    }, 300) // 300ms 对应 CSS transition 时间
  }

  const handleAccept = () => {
    handleClose('accepted')
  }

  const handleReject = () => {
    handleClose('rejected')
  }

  if (!visible) return null

  return (
    <View className='cookie-consent-modal'>
      <View className={`cookie-consent-modal-overlay ${animationVisible ? 'visible' : ''}`} />
      <View className={`cookie-consent-modal-content ${animationVisible ? 'visible' : ''}`}>
        <View className='cookie-text'>
          <SpHtml content={policyData} />
        </View>
        <View className='cookie-buttons'>
          <Button className='accept-btn' onClick={handleAccept}>ACCEPT ALL</Button>
          <Button className='reject-btn' onClick={handleReject}>REJECT ALL</Button>
        </View>
      </View>
    </View>
  )
}

export default CookieConsent
