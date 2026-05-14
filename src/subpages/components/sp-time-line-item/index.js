/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useImperativeHandle } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text, Image } from '@tarojs/components'
import { useTranslation, $t, ti } from '@/i18n'
import './index.scss'

const initState = {}
function SpTimeLineItem(props) {
  useTranslation()
  const [state, setState] = useImmer(initState)

  const {} = state

  const { item, children } = props

  const handlePreviewPics = (idx) => {
    Taro.previewImage({
      urls: item.pics,
      current: item.pics[idx]
    })
  }

  return (
    <View className='time-line-item'>
      <View className='left-dot'></View>
      <View className='content'>
        <View className='content-title'>{item.title}</View>
        {item.delivery_remark && (
          <View className='content-remark'>{ti('a2bfdfc4.b8e67c', [item.delivery_remark])}</View>
        )}
        {item.pics.length > 0 && (
          <View>
            <Text>{$t('a2bfdfc4.617ba4')}</Text>
            <View className='content-pic'>
              {item.pics.map((pic, idx) => (
                <Image
                  src={pic}
                  className='content-pic-item'
                  key={idx}
                  onClick={() => handlePreviewPics(idx)}
                ></Image>
              ))}
            </View>
          </View>
        )}
        {/* {children} */}
      </View>
    </View>
  )
}

export default SpTimeLineItem
