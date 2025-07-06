import React, { useRef, useState, useCallback } from 'react'
import { View } from '@tarojs/components'
import { LuckyWheel } from '@lucky-canvas/taro/react'
import './index.scss'

const SpWheel = ({ config, onDrawPrize, onGameEnd, isDrawing, style }) => {
  const wheelRef = useRef(null)

  const resultRef = useRef(null)

  // 开始抽奖
  const handleStart = async () => {
    if (isDrawing || !wheelRef.current) return
    try {
      // 调用父组件的抽奖接口获取结果
      const result = await onDrawPrize()
      resultRef.current = result
      if (result.code == 0) {
        // 开始旋转
        wheelRef.current.play()
        setTimeout(() => {
          const prize_type = result?.data?.prize_type
          console.log('config?.prizes----', config?.prizes)
          const _id = config?.prizes?.findIndex((el) => el.prize_type == prize_type)
          console.log('stop----', _id)
            wheelRef.current.stop(_id)
        }, 2000)
      }
    } catch (err) {
      console.error('抽奖出错:', err)
    }
  }
  // 抽奖结束
  const handleEnd = () => {
    console.log('resultRef.current----', resultRef.current)
    onGameEnd && onGameEnd(resultRef.current)
  }
  return (
    <View className='sp-wheel' style={style}>
      <LuckyWheel
        ref={wheelRef}
        width={config.width || '300px'}
        height={config.height || '300px'}
        blocks={config.blocks || []}
        prizes={config.prizes || []}
        buttons={config.buttons || []}
        defaultConfig={config.defaultConfig || {}}
        defaultStyle={config.defaultStyle || {}}
        onStart={handleStart}
        onEnd={handleEnd}
      />
    </View>
  )
}

export default SpWheel
