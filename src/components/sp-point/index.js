import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

const SpPoint = (props) => {
  const { value = 0, className } = props
  const { pointName } = useSelector((state) => state.sys)

  return (
    <Text className={classNames('sp-point', className)}>
      <Text className='point'>{value}</Text>
      <Text className='unit'>{pointName}</Text>
    </Text>
  )
}

export default SpPoint
