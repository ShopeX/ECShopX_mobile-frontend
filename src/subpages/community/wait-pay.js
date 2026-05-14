/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage, SpPrice } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import WpGoodsItem from './comps/wp-goods-item'
import './wait-pay.scss'

const WaitPay = () => {
  const { i18n } = useTranslation()
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('07af6734.9246fe') })
  }, [i18n.language])

  const renderFooter = () => {
    return (
      <View className='waitPay-toolbar'>
        <SpPrice value={0.01} />

        <View className='espierCheckout-toolbar__button'>{$t('b1a8838b.747349')}</View>
      </View>
    )
  }

  return (
    <SpPage className='page-community-index' renderFooter={renderFooter()}>
      <View className='waitPay'>
        <View className='waitPay-header'>
          <View className='waitPay-header__info'>
            <View className='waitPay-header__info-title'>{$t('9a75e14c.9246fe')}</View>
            <View className='waitPay-header__info-time'>{ti('9a75e14c.f7313d', ['00:01:10'])}</View>
          </View>

          <View className='waitPay-header__img'>
            <SpImage />
          </View>
        </View>

        <View className='waitPay-title'>{$t('934ffec2.b30d27')}</View>
        <View className='waitPay-address'>
          <View className='waitPay-address__info'>
            <View className='waitPay-address__info-strong'>
              <Text className='iconfont icon iconfont icon-member'></Text>
              {ti('9a75e14c.e830ab', [$t('9a75e14c.af4619')])}
            </View>
            <View className='waitPay-address__info-position'>{$t('9a75e14c.8a9698')}</View>
          </View>

          <View className='waitPay-address__user'>
            <View>
              <Text className='iconfont icon iconfont icon-member'></Text>
              <Text className='waitPay-address__user-name'>{$t('9a75e14c.35184b')}</Text>
              13122102222
            </View>
            <View className='waitPay-address__user-li'>{$t('9a75e14c.c610ae')}</View>
            <View className='waitPay-address__user-li'>{ti('9a75e14c.c5e6af', [10])}</View>
            <View className='waitPay-address__user-li'>{ti('9a75e14c.b6e355', [606])}</View>
            <View className='waitPay-address__user-li'>{ti('9a75e14c.566e0e', [11])}</View>
          </View>

          <View className='waitPay-address__remarks'>
            <Text className='iconfont icon iconfont icon-member'></Text>
            {ti('9a75e14c.1fd67f', [$t('9a75e14c.a4d0bf')])}
          </View>
        </View>

        <View className='waitPay-title'>
          <View className='waitPay-title__l'>
            <View className='waitPay-title__img'>
              <SpImage />
            </View>
            <View>Kris</View>
          </View>

          <View className='waitPay-title__r'>
            {$t('9a75e14c.a51a1c')}
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='waitPay-goods'>
          <WpGoodsItem />
          <WpGoodsItem />

          <View className='waitPay-goods__price'>
            <View>{$t('9a75e14c.cbff02')}</View>
            <SpPrice value={0.02} />
          </View>
        </View>

        <View className='waitPay-total'>
          <Text className='waitPay-total__num'>{ti('b1a8838b.17d01f', [10])}</Text>
          {$t('b1a8838b.05a5a8')}
          <SpPrice value={0.02} />
        </View>

        <View className='waitPay-title'>{$t('9a75e14c.a6d10d')}</View>
        <View className='waitPay-order'>
          <View className='waitPay-order__item'>
            <View className='waitPay-order__item-label'>{$t('9a75e14c.31146f')}</View>
            <View className='waitPay-order__item-avatar'>
              <SpImage />
            </View>
            <View className='waitPay-order__item-name'>vip</View>
            <View className='waitPay-order__item-avatar'>
              <SpImage />
            </View>
            <View className='waitPay-order__item-btn'>
              <Text className='iconfont icon iconfont icon-member'></Text>
              {$t('9a75e14c.8b2408')}
            </View>
          </View>
          <View className='waitPay-order__item'>
            <View className='waitPay-order__item-label'>{$t('9a75e14c.148237')}</View>
            1321321312321321
            <View className='waitPay-order__item-btn'>{$t('523123e1.79d3ab')}</View>
          </View>
          <View className='waitPay-order__item'>
            <View className='waitPay-order__item-label'>{$t('9a75e14c.ca25d2')}</View>
            2022/4/22 13:12
          </View>
        </View>

        <View className='waitPay-close'>{$t('9a75e14c.b1ebc5')}</View>
      </View>
    </SpPage>
  )
}

export default WaitPay
