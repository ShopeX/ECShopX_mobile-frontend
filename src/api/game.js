/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'
// 抽奖API模拟实现
export const drawPrize = async (id) => {
  try {
    const res = await req.get('/promotion/turntable', {
      activity_id: id
    })
    if (!res?.status_code) {
      return {
        code: 0,
        data: res,
        message: 'success'
      }
    } else {
      return {
        code: 1,
        message: '活动不存在'
      }
    }
  } catch (error) {
    console.log('抽奖error')
    return {
      code: 1,
      message: '活动不存在'
    }
  }
}

// 获取游戏活动配置
export const getGameConfig = (params = {}) => {
  return req.get('/promotion/getLuckyDrawData', params)
}

// 获取抽奖记录
export const getDrawRecords = (id) => {
  return req.get('/promotion/getLuckyDrawLog', {
    id
  })
}
