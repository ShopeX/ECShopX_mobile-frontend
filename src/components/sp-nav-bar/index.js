// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
