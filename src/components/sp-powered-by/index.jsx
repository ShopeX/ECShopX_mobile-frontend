/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { memo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

function SpPoweredBy(props) {
  const { className } = props
  return (
    <View className={classNames('sp-powered-by', className)}>
      <Text className='sp-powered-by__text'>Powered by</Text>
      <Image src='/assets/imgs/powered-logo.png' className='sp-powered-by__logo' mode='contain' />
    </View>
  )
}

export default memo(SpPoweredBy)
