import React, { useMemo, useCallback } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'

import './heading.scss'

function WgtHeading(props) {

  if (!props.info) {
    return null
  }

  const { config, base, data } = props.info || {}

  const computedStyle = useCallback(() => {
    return {
      textAlign: config.align,
      color: config.color,
      fontSize: Taro.pxTransform(config.fontSize * 2),
      fontStyle: config.italic,
      lineHeight: config.lineHeight,
      fontWeight: config.weight
    }
  }, [config])


  return <View className={classNames(`wgt wgt-heading`, {
    'wgt__padded': base.padded
  })}>
    <View className={classNames(`wgt-body`, {
      'padded': config.padded
    })} style={computedStyle()}>
      {base.title}
    </View>
  </View>
}

WgtHeading.defaultProps = {
  info: null
}

export default WgtHeading