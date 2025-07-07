import React, { useEffect } from 'react'
import { View, Image } from '@tarojs/components'
import { AtCurtain, AtButton } from 'taro-ui'
import useModal from '@/hooks/useModal'
import Taro from '@tarojs/taro'
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
  // 判断是否是未中奖情况
  const resData = prizeInfo?.data || {}
  const isEmptyPrize = resData?.prize_type === 'thanks'
  const { showModal } = useModal()
  useEffect(() => {
    if (visible) {
      if (isEmptyPrize) {
        showModal({
          title: '未中奖',
          content: '再接再厉，下次一定会中奖！',
          showCancel: false,
          confirmText: '我知道了',
          contentAlign: 'center'
        }).finally(() => {
          onClose()
        })
      } else if (insufficientFV) {
        showModal({
          title: '积分不足',
          content: `您当前的积分为 ${currentFV}，需要 ${requiredFV} 积分才能抽奖`,
          showCancel: false,
          confirmText: '我知道了',
          contentAlign: 'center'
        }).finally(() => {
          onClose()
        })
      }
    }
  }, [visible])

  // 渲染内容
  const renderContent = () => {
    if (!insufficientFV && !isEmptyPrize) {
      // 中奖情况
      return (
        <View className='sp-draw-result__prize'>
          <View className='sp-draw-result__title'>恭喜中奖</View>
          {resData?.prizeImage && (
            <Image className='sp-draw-result__image' src={resData?.prizeImage} mode='aspectFit' />
          )}
          {resData?.prize_type !='points' && (
            <View className='sp-draw-result__prize-name'>{resData?.prize_title}</View>
          )}
          {resData?.prize_value && resData?.prize_type =='points' && (
            <View className='sp-draw-result__prize-amount'>
              {resData?.prize_value}积分
            </View>
          )}
          <View className='sp-draw-result__message'>{resData?.message || '恭喜您获得奖品！'}</View>
          <View className='sp-draw-result-btn__wrap'>
            <AtButton className='sp-draw-result__btn sp-draw-result__btn_left' onClick={onClose}>
              返回
            </AtButton>
            <AtButton
              className='sp-draw-result__btn sp-draw-result__btn_right'
              onClick={() => {
                Taro.navigateTo({ url: `/subpages/game-activity/pages/records?id=${id}` })
              }}
            >
              查看奖励
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
