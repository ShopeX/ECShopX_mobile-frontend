import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtInput } from 'taro-ui'
import './index.scss'

const initialState = {
  keywords: ''
}
function SpSearchInput(props) {
  const { placeholder = '搜索', isFixTop, onConfirm = () => {} } = props
  const [state, setState] = useImmer(initialState)
  const { keywords } = state

  const handleChangeSearch = (e) => {
    setState(draft => {
      draft.keywords = e
    })
  }

  const handleConfirm = () => {
    onConfirm(keywords)
  }

  return (
    <View className='sp-search-input'>
      <View className='iconfont icon-sousuo-01'></View>
      <AtInput
        value={keywords}
        name='keywords'
        placeholder={placeholder}
        onChange={handleChangeSearch}
        onConfirm={handleConfirm}
      />
    </View>
  )
}

SpSearchInput.options = {
  addGlobalClass: true
}

export default SpSearchInput
