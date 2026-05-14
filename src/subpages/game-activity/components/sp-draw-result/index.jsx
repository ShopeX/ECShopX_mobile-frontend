/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Image } from '@tarojs/components'
import { AtCurtain, AtButton } from 'taro-ui'
import useModal from '@/hooks/useModal'
import Taro from '@tarojs/taro'
import { useTranslation, $t, ti } from '@/i18n'
import './index.scss'

// 抽奖结果幕帘组件
const SpDrawResult = ({
  visible,
  prizeInfo = {},
  onClose,
  id,
  insufficientFV = false,
  requiredFV = 0,
  currentFV = 0
}) => {
  useTranslation()
  // 判断是否是未中奖情况
  const resData = prizeInfo?.data || {}
  const isEmptyPrize = resData?.prize_type === 'thanks'
  const { showModal } = useModal()
  useEffect(() => {
    if (visible) {
      if (isEmptyPrize) {
        showModal({
          title: $t('f326b92a.1229c3'),
          content: $t('f326b92a.23300f'),
          showCancel: false,
          confirmText: $t('f326b92a.fe0337'),
          contentAlign: 'center'
        }).finally(() => {
          onClose()
        })
      } else if (insufficientFV) {
        showModal({
          title: $t('f326b92a.96551d'),
          content: ti('f326b92a.cfd2f6', [currentFV, requiredFV]),
          showCancel: false,
          confirmText: $t('f326b92a.fe0337'),
          contentAlign: 'center'
        }).finally(() => {
          onClose()
        })
      }
    }
  }, [visible, isEmptyPrize, insufficientFV, currentFV, requiredFV, onClose])

  // 渲染内容
  const renderContent = () => {
    if (!insufficientFV && !isEmptyPrize) {
      // 中奖情况
      return (
        <View className='sp-draw-result__prize'>
          <View className='sp-draw-result__title'>{$t('f326b92a.84c17c')}</View>
          {resData?.prizeImage && (
            <Image className='sp-draw-result__image' src={resData?.prizeImage} mode='aspectFit' />
          )}
          {resData?.prize_type != 'points' && (
            <View className='sp-draw-result__prize-name'>{resData?.prize_title}</View>
          )}
          {resData?.prize_value && resData?.prize_type == 'points' && (
            <View className='sp-draw-result__prize-amount'>
              {ti('f326b92a.511b20', [resData?.prize_value])}
            </View>
          )}
          <View className='sp-draw-result__message'>
            {resData?.message || $t('f326b92a.7ba17f')}
          </View>
          <View className='sp-draw-result-btn__wrap'>
            <AtButton className='sp-draw-result__btn sp-draw-result__btn_left' onClick={onClose}>
              {$t('f326b92a.5f4112')}
            </AtButton>
            <AtButton
              className='sp-draw-result__btn sp-draw-result__btn_right'
              onClick={() => {
                Taro.navigateTo({ url: `/subpages/game-activity/pages/records?id=${id}` })
              }}
            >
              {$t('f326b92a.7c271c')}
            </AtButton>
          </View>
        </View>
      )
    }
  }

  return (
    <>
      {isEmptyPrize || insufficientFV ? (
        <></>
      ) : (
        <AtCurtain isOpened={visible} onClose={onClose}>
          <View className='sp-draw-result'>{renderContent()}</View>
        </AtCurtain>
      )}
    </>
  )
}

export default SpDrawResult
