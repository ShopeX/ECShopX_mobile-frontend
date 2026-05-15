/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPrice, SpLogin } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './comp-vipguide.scss'

function CompVipGuide(props) {
  useTranslation()
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
          <SpPrice noSymbol value={info.gradeDiscount} appendText={$t('97c6bb81.96c015')}></SpPrice>
          {/* )} */}
        </View>
        <View className='vip-desc'>{info.guide_title_desc}</View>
      </View>
      <SpLogin className='btn-join' onChange={onChangeLogin}>
        {$t('bfc5ccea.16a762')} <Text className='iconfont icon-qianwang-011'></Text>
      </SpLogin>
    </View>
  )
}

CompVipGuide.options = {
  addGlobalClass: true
}

export default CompVipGuide
