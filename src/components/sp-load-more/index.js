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
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { classNames, navigateTo } from '@/utils'
import { SpLoading, SpDefault } from '@/components'

import './index.scss'

function SpLoadMore(props) {
  const { loading = false, hasNext, total = 0, className } = props

  return (
    <View className={classNames('sp-loading-more')}>
      {loading && <SpLoading>正在加载...</SpLoading>}
      {!hasNext && total == 0 && <SpDefault type='cart' message='没有查询到数据～' />}
      {!loading && !hasNext && total > 0 && <View className='nomore-txt'>--没有更多数据了--</View>}
    </View>
  )
}

export default SpLoadMore
