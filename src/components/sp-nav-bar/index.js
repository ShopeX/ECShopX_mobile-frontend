import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { classNames, isWeb, isNavbar } from '@/utils'

import './index.scss'

function SpNavBar (props) {
  const { leftIconType = 'chevron-left', title: p_title, onClickLeftIcon } = props
  // const { page } = getCurrentInstance()
  const { pageTitle } = useSelector((state) => state.sys)
  // const defaultTitle = page ? page.config?.navigationBarTitleText : p_title

  const handleClickLeftIcon = function () {
    onClickLeftIcon ? onClickLeftIcon() : Taro.navigateBack()
  }

  if (!isNavbar()) {
    return null
  }

  return (
    <AtNavBar
      fixed
      color='#000'
      title={pageTitle}
      leftIconType={leftIconType}
      onClickLeftIcon={handleClickLeftIcon}
    />
  )
}

SpNavBar.options = {
  addGlobalClass: true
}

export default SpNavBar
