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
import React from 'react'
import { View } from '@tarojs/components'
import { SpHtml } from '@/components'
import './index.scss'

const SpRuleLayout = ({ rules = '' }) => {
  return (
    <View className='sp-rule-layout'>
      <View className='sp-rule-layout__title'>活动规则</View>
      <View className='sp-rule-layout__content'>
        <SpHtml content={rules} />
      </View>
    </View>
  )
}

export default SpRuleLayout
