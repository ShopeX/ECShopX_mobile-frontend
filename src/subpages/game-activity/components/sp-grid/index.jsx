import React, { useRef } from 'react'
import { View } from '@tarojs/components'
import { LuckyGrid } from '@lucky-canvas/taro/react'
import './index.scss'

const SpGrid = ({ config, onDrawPrize, isDrawing, onGameEnd }) => {
  const luckyGridRef = useRef()

  // 开始抽奖
  const handleStart = async () => {
    if (isDrawing || !luckyGridRef.current) return

    // 开始抽奖
    luckyGridRef.current.play()

    try {
      // 调用父组件的抽奖接口获取结果
      const result = await onDrawPrize()

      if (result) {
        // 停止在指定奖品索引
        luckyGridRef.current.stop(result.prizeIndex)
      } else {
        // 抽奖失败，停止在第一个位置
        luckyGridRef.current.stop(0)
      }
    } catch (err) {
      console.error('抽奖出错:', err)
      luckyGridRef.current.stop(0)
    }
  }

  // 抽奖结束
  const handleEnd = () => {
    onGameEnd && onGameEnd()
  }

  return (
    <View className='sp-grid'>
      <LuckyGrid
        ref={luckyGridRef}
        width={config.width || '300px'}
        height={config.height || '300px'}
        blocks={config.blocks || []}
        prizes={config.prizes || []}
        buttons={config.buttons || []}
        defaultConfig={config.defaultConfig || {}}
        defaultStyle={config.defaultStyle || {}}
        activeStyle={config.activeStyle || {}}
        onStart={handleStart}
        onEnd={handleEnd}
        rows={config.rows || 3}
        cols={config.cols || 3}
      />
    </View>
  )
}

export default SpGrid
