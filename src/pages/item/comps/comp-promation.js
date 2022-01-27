import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpFloatLayout } from '@/components'
import './comp-promation.scss'

function CompPromation (props) {
  const { open = false } = props
  return (
    <SpFloatLayout
      className='comp-promation'
      open={open}
      hideClose
      renderFooter={
        <View>
          <Text>取消</Text>
        </View>
      }
    >
      <View className='promation-list'></View>
    </SpFloatLayout>
  )
}

CompPromation.options = {
  addGlobalClass: true
}

export default CompPromation
