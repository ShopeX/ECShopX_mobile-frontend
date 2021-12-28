import React, { useState, useEffect } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { classNames, isWeb, isNavbar } from '@/utils'

import './index.scss'

function SpNavBar(props) {
  const { leftIconType = 'chevron-left', title: p_title } = props
  const { page } = getCurrentInstance()
  const defaultTitle = page ? page.config?.navigationBarTitleText : p_title
  const [title, setTitle] = useState("")

  const handleClickLeftIcon = function () {
    Taro.navigateBack()
  }

  useEffect( () => {
    Taro.eventCenter.on( 'set-pagetitle', ( title ) => {
      console.log('page title:', title)
      setTitle(title)
    })
  }, [])

  if ( !isNavbar() ) {
    return null
  }
  
  return (
    <AtNavBar
      fixed
      color="#000"
      title={defaultTitle || title}
      leftIconType={leftIconType}
      onClickLeftIcon={handleClickLeftIcon}
    />
  );
}

SpNavBar.options = {
  addGlobalClass: true
}

export default SpNavBar

