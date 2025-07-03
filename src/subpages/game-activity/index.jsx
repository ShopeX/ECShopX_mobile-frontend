import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { getGameConfig, drawPrize } from '@/api/game'
import { GAME_TYPES } from '@/consts/game'
import { pickBy } from '@/utils'
import { GAME_CONFIG } from '@/doc/game'
import SpWheel from './components/sp-wheel'
import SpGrid from './components/sp-grid'
import SpSlot from './components/sp-slot'
import SpRuleLayout from './components/sp-rule-layout'
import SpDrawResult from './components/sp-draw-result'
import ActiveTotalControl from './components/sp-active-header'

import './index.scss'

const GameActivity = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activityConfig, setActivityConfig] = useState(null)
  const [gameType, setGameType] = useState('')

  const [userInfo, setUserInfo] = useState(null)

  // 抽奖结果相关状态
  const [resultVisible, setResultVisible] = useState(false)
  const [resultData, setResultData] = useState({})

  // 活动规则数据
  const [rules, setRules] = useState('')
  const [activeId, setActiveId] = useState('')

  // 是否正在抽奖中
  const isDrawing = useRef(false)

  useEffect(() => {
    loadActivityData()
  }, [])

  // 加载活动数据
  const loadActivityData = async () => {
    setLoading(true)
    setError(null)

    try {
      // 获取页面参数，只需获取游戏类型，不需要活动ID
      const { type,id = '4' } = Taro.getCurrentInstance().router.params

      // 调用API获取活动配置
      const response = await getGameConfig({id})

      if (response && response?.activity_template_config) {
        // 使用doc配置处理游戏配置数据，保留gameConfig层级
        console.log('response.data----', response)
        const processedConfig = pickBy(response.activity_template_config, GAME_CONFIG)
        console.log('processedConfig----', processedConfig)
        const _gameType = type || processedConfig.gameType

        setActivityConfig(processedConfig)
        setGameType(_gameType)
        setRules(response.intro)
        setUserInfo({
          ...response.user_info,
          cost_value: response.cost_value
        })
        setActiveId(response.id)

        // 设置加载完成
        setLoading(false)
      } else {
        setError('获取活动配置失败')
        setLoading(false)
      }
    } catch (err) {
      console.error('加载活动数据出错:', err)
      setError('加载活动数据出错')
      setLoading(false)
    }
  }

  // 修改抽奖结果处理函数
  const handleDrawPrize = useCallback( async () => {
    if (isDrawing.current) return null
    isDrawing.current = true

    try {
      // 调用抽奖接口获取结果
      const response = await drawPrize(activeId)
      if (response) {
        if (response.code === 0) {
          // 抽奖成功，显示结果
          setResultData(response)
          return response
        } else if (response.code === 1001) {
          // FV不足情况
          setResultData({
            insufficientFV: true,
            requiredFV: response.requiredFV,
            currentFV: response.currentFV
          })
          return Promise.reject(response)
        } else {
          return Promise.reject(response)
        }
      } else {
        return Promise.reject(response)
      }
    } catch (err) {
      console.error('抽奖请求失败:', err)
      return Promise.reject(response)
    }
  },[activeId])

  // 修改关闭结果弹窗的处理函数
  const handleCloseResult = () => {
    setResultVisible(false)
    setResultData({})
  }

  const handleGameEnd = (result) => {
    setTimeout(() => {
      //等待canvas绘制结束，否则游戏组件没有变成图片之前，弹框盖不住
      if (result?.code == 0) {
        isDrawing.current = false
        setResultVisible(true)
        setResultData(result?.data)
      } else {
        isDrawing.current = false
      }
    }, 600)
  }
  // 修改渲染游戏组件函数，使用正确的回调名称
  const renderGameComponent = useMemo(() => {
    if (!activityConfig || !activityConfig.gameConfig) return null

    const commonProps = {
      config: activityConfig.gameConfig,
      onDrawPrize: handleDrawPrize, //这里需要考虑无法抽奖的场景，如果无法抽奖是否游戏组件需要不执行start
      isDrawing: isDrawing?.current,
      onGameEnd: handleGameEnd
    }
    console.log('gameType----', gameType, activityConfig)
    switch (gameType) {
      case GAME_TYPES.WHEEL:
        return <SpWheel {...commonProps} />
      case GAME_TYPES.GRID:
        return <SpGrid {...commonProps} />
      case GAME_TYPES.SLOT:
        return <SpSlot {...commonProps} />
      default:
        return (
          <View className='sp-game-activity__unsupported'>
            <Text>不支持的游戏类型</Text>
          </View>
        )
    }
  }, [activityConfig?.gameConfig,gameType,activeId])

  // 渲染背景样式
  const getPageStyle = () => {
    if (activityConfig?.backgroundImage) {
      return {
        backgroundImage: `url(${activityConfig.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
    return {}
  }

  return (
    <View className='sp-game-activity'>
      <View className='sp-game-activity__ad-area' style={getPageStyle()}>
        {/* 加载状态 */}
        {loading && (
          <View className='sp-game-activity__loading'>
            <View className='sp-game-activity__loading-icon'></View>
            <Text className='sp-game-activity__loading-text'>加载中...</Text>
          </View>
        )}

        {/* 错误状态 */}
        {error && (
          <View className='sp-game-activity__error'>
            <Text className='sp-game-activity__error-text'>{error}</Text>
            <AtButton size='normal' onClick={loadActivityData}>
              重试
            </AtButton>
          </View>
        )}

        {!loading && !error && (
          <>
            <View style={{ marginTop: activityConfig?.gameMarginTop || 0 }}>
              <ActiveTotalControl userInfo={userInfo} />
            </View>
            {/* 游戏容器 */}

            {activityConfig && (
              <>
                <View className='sp-game-activity__game-container'>{renderGameComponent}</View>
                <View className='sp-game-activity__footer'>
                  <View
                    className='sp-game-activity__footer-btn'
                    onClick={() =>
                      Taro.navigateTo({
                        url: `/subpages/game-activity/pages/records?id=${activeId}`
                      })
                    }
                  >
                    抽奖记录
                  </View>
                </View>
              </>
            )}
            <SpRuleLayout rules={rules} />
          </>
        )}

        {/* 抽奖结果幕帘 */}
        <SpDrawResult
          id={activeId}
          visible={resultVisible}
          onClose={handleCloseResult}
          prizeInfo={resultData.insufficientFV ? {} : resultData}
          insufficientFV={resultData.insufficientFV}
          requiredFV={resultData.requiredFV}
          currentFV={resultData.currentFV}
        />
      </View>
    </View>
  )
}

export default GameActivity
