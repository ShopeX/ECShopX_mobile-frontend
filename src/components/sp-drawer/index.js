import React from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import { SpButton } from '@/components'
import './index.scss'

const voidFn = () => {}

function SpDrawer (props) {
  const { show, onClose = voidFn, children, onReset = voidFn, onConfirm = voidFn } = props
  return (
    <AtDrawer className='sp-drawer' show={show} right mask onClose={onClose} width='260px'>
      <ScrollView className='sp-drawer__body' scrollY>
        {children}
      </ScrollView>
      <View className='sp-drawer__footer'>
        <SpButton
          resetText='重置'
          confirmText='确定并筛选'
          onConfirm={onConfirm}
          onReset={onReset}
        ></SpButton>
      </View>
    </AtDrawer>
  )
}

export default SpDrawer
