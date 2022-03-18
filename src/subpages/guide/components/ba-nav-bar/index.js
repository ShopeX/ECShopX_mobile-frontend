import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { styleNames } from '@/utils'
import './index.scss'

const initialState = {
  navbarH: 0,
  statusBarHeight: 0
}
function BaNavBar(props) {
  const { home = false, back = false, title = '' } = props
  const [state, setState] = useImmer(initialState)
  const { navbarH, statusBarHeight } = state

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const menuButton = await Taro.getMenuButtonBoundingClientRect()
    const { statusBarHeight } = await Taro.getSystemInfoSync()

    console.log('MenuButton:', menuButton, statusBarHeight)

    setState((draft) => {
      ;(draft.navbarH =
        statusBarHeight + menuButton.height + (menuButton.top - statusBarHeight) * 2),
        (draft.statusBarHeight = statusBarHeight)
    })
  }

  return (
    <View
      className='ba-navbar'
      style={styleNames({
        height: `${navbarH}px`,
        paddingTop: `${statusBarHeight}px`
      })}
    >
      <View className='left-container'>
        <Text
          className='in-icon icon-home1'
          onClick={() => {
            Taro.navigateTo({ url: '/subpages/guide/index' })
          }}
        ></Text>
      </View>
      <View className='title-container'>{title}</View>
      <View className='right-container'></View>
    </View>
  )
}

BaNavBar.options = {
  addGlobalClass: true
}

export default BaNavBar
