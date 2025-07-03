import React from 'react'
import { View } from '@tarojs/components'
import './index.scss'

const SpRuleLayout = ({ rules = '' }) => {
  return (
    <View className='sp-rule-layout'>
      <View className='sp-rule-layout__title'>活动规则</View>
      <View className='sp-rule-layout__content'>{rules}</View>
    </View>
  )
}

export default SpRuleLayout
