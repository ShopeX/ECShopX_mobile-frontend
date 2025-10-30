// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
