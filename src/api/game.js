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
