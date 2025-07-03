import React, { useRef } from 'react'
import { View } from '@tarojs/components'
import { SlotMachine } from '@lucky-canvas/taro/react'
import './index.scss'

const SpSlot = ({ config, onDrawPrize, onGameEnd, isDrawing, style }) => {
  const slotRef = useRef(null)

  // 开始抽奖
  const handleStart = async () => {
    if (isDrawing || !slotRef.current) return

    // 开始老虎机
    slotRef.current.play()

    try {
      // 调用父组件的抽奖接口获取结果
      const result = await onDrawPrize()

      if (result) {
        // 停止在指定奖品索引
        slotRef.current.stop(result.prizeIndex)
      } else {
        // 抽奖失败，停止老虎机
        slotRef.current.stop(0)
      }
    } catch (err) {
      console.error('抽奖出错:', err)
      slotRef.current.stop(0)
    }
  }

  // 抽奖结束
  const handleEnd = (prize) => {
    onGameEnd && onGameEnd()
  }

  return (
    <View className='sp-slot' style={style} onClick={handleStart}>
      <SlotMachine
        ref={slotRef}
        width={config.width || '300px'}
        height={config.height || '240px'}
        blocks={config.blocks || []}
        prizes={config.prizes || []}
        slots={config.slots || []}
        defaultConfig={config.defaultConfig || {}}
        defaultStyle={config.defaultStyle || {}}
        onStart={handleStart}
        onEnd={handleEnd}
      />
    </View>
  )
}

export default SpSlot
