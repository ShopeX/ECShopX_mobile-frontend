import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-role2.scss'
import userIcon from '@/assets/imgs/user-icon.png'
import CompBottomTip from './comps/comp-bottomTip'
import arrow from '@/assets/imgs/arrow.png'

const initialState = {}

function SelectRole(props) {
  const [options, setOptions] = useState([
    { title: '亲友', value: 'friend' },
    { title: '员工', value: 'staff' }
  ])
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {

  }, [])

  const handleOptionClick = (index) => {
    console.log(index)
    setActiveIndex((val) => (val = index))
  }

  const handleConfirmClick = ()=>{
    //todo
    console.log('confirm',options[activeIndex].title)
  }

  return (
    <View className='select-role'>
      <View className='header'>
        <Image className='header-avatar' src={userIcon} mode='aspectFill' />
        <Text className='welcome'>欢迎登陆</Text>
        <Text className='title'>上海商派员工亲友购</Text>
      </View>
      <View className='select'>
        <View className='select-title'>我是</View>
        <View className='select-options'>
          {options.map((item, index) => {
            return (
              <View
                className={classNames('select-friend', {
                  'active': activeIndex === index
                })}
                key={item.title}
                onClick={() => handleOptionClick(index)}
              >
                <Image className='select-pic' src={arrow} />
                <View className='select-content'>{item.title}</View>
              </View>
            )
          })}
        </View>
        <View className='btn-confirm'>
          <button
            className={classNames('confirm', {
              'active': [0,1].includes(activeIndex)
            })}
            onClick={handleConfirmClick}
          >
            确定
          </button>
        </View>
      </View>
      <CompBottomTip />
    </View>
  )
}

SelectRole.options = {
  addGlobalClass: true
}

export default SelectRole
