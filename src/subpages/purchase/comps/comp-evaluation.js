/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames } from '@/utils'
import { useTranslation, ti, $t } from '@/i18n'
import './comp-evaluation.scss'

function CompEvaluation(props) {
  useTranslation()
  const { className, list = [], itemId } = props

  const onViewMore = () => {
    let url = `/marketing/pages/item/espier-evaluation?id=${itemId}`
    // if (this.isPointitemGood()) {
    //   url += `&order_type=pointsmall`
    // }
    Taro.navigateTo({
      url: url
    })
  }

  return (
    <View className={classNames('comp-evaluation', className)}>
      <View className='evaluation-hd'>
        <View className='title'>{ti('18b2941b.0c834e', [list.length])}</View>
        {list.length > 0 && (
          <View className='extra-more' onClick={onViewMore}>
            {$t('18b2941b.0467cc')}
            <Text className='iconfont icon-qianwang-01'></Text>
          </View>
        )}
      </View>
      <View className='evaluation-bd'>
        {list.map((item) => (
          <View className='evaluation-item-wrap'>
            <View className='item-hd'>
              <SpImage src={item.avatar} className='evaluation-icon' width={50} height={50} />
              <Text className='evaluation-name'>{item.username || $t('18b2941b.708229')}</Text>
            </View>
            <View className='evaluation-content'>{item.content}</View>
          </View>
        ))}
        {list.length == 0 && <View className='default-msg'>{$t('18b2941b.5a8497')}</View>}
      </View>
    </View>
  )
}

CompEvaluation.options = {
  addGlobalClass: true
}

export default CompEvaluation
