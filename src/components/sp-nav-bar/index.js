import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtNavBar } from 'taro-ui'
import { classNames, isWeb, isNavbar } from '@/utils'

import './index.scss'

function SpNavBar(props) {
  const { leftIconType = 'chevron-left', title, onClickLeftIcon } = props
  // const { page, router } = getCurrentInstance()
  // const allPages = Taro.getCurrentPages()
  // console.log('SpNavBar:', page)
  // // const { pageTitle } = useSelector((state) => state.sys)
  // const pageTitle = page ? page.config?.navigationBarTitleText : p_title

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
      title={title}
      leftIconType={leftIconType}
      onClickLeftIcon={handleClickLeftIcon}
      className={classNames('sp-nav-bar')}
    />
  )
}

SpNavBar.options = {
  addGlobalClass: true
}

export default SpNavBar
