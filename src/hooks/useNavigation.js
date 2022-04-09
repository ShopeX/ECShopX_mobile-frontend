import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'

export default (props = {}) => {
  const setNavigationBarTitle = (title) => {
    Taro.setNavigationBarTitle({
      title
    })
    const { page } = getCurrentInstance()
    const allPages = Taro.getCurrentPages()
    console.log('allPages:', allPages)
    page.config['navigationBarTitleText'] = title
  }

  return {
    setNavigationBarTitle
  }
}
