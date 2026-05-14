/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { $t } from '@/i18n'
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
        message: $t('7b1e93f4.2c4cd7')
      }
    }
  } catch (error) {
    console.log('抽奖error')
    return {
      code: 1,
      message: $t('7b1e93f4.2c4cd7')
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
