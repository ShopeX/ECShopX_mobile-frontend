import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPrice, SpLogin } from '@/components'
import './comp-vipguide.scss'

function CompVipGuide(props) {
  const { info } = props

  const onChangeLogin = () => {
    Taro.navigateTo({
      url: `/subpage/pages/vip/vipgrades?grade_name=${info.vipgrade_name}`
    })
  }

  if (!info.vipgrade_name) {
    return null
  }

  return (
    <View className='comp-vipguide'>
      <View className='vip-info'>
        <View className='vip-value'>
          <View className='vip-label'>{info.vipgrade_desc}</View>
          {/* {info.memberPrice && <SpPrice value={info.memberPrice}></SpPrice>} */}
          {/* {info.gradeDiscount && ( */}
          <SpPrice noSymbol value={info.gradeDiscount} appendText='折'></SpPrice>
          {/* )} */}
        </View>
        <View className='vip-desc'>{info.guide_title_desc}</View>
      </View>
      <SpLogin className='btn-join' onChange={onChangeLogin}>
        立即加入 <Text className='iconfont icon-qianwang-011'></Text>
      </SpLogin>
    </View>
  )
}

CompVipGuide.options = {
  addGlobalClass: true
}

export default CompVipGuide
