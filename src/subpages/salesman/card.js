/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPage } from '@/components'
import { $t, useTranslation } from '@/i18n'
import './card.scss'

const Card = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('dd67e2ce.758853') })
  }, [i18n.language])

  return (
    <SpPage className={classNames('page-card-index')} navbar={false}>
      <View className='card-box'>
        <View className='card-content'>
          <View className='name'>{$t('6fcfb6ab.9473b9')}</View>
          <View className='store'>{$t('6fcfb6ab.27e2df')}</View>
          <View className='qtr-box'>
            <image
              className='qtr-img'
              src='https://img0.baidu.com/it/u=3584759695,3470619884&fm=253&fmt=auto&app=138&f=GIF?w=198&h=198'
            />
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default Card
