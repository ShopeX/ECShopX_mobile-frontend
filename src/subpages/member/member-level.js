import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View } from '@tarojs/components'
import './member-level.scss'

function MemberLevel(props) {
  return <View className='page-member-level'></View>
}

MemberLevel.options = {
  addGlobalClass: true
}

export default MemberLevel
