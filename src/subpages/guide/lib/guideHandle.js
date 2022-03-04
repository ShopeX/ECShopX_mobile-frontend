// 三天时间戳
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { normalizeQuerys } from '@/utils/index'
import S from '@/spx'
import api from '@/api'

const treeDay = 86400000 * 3

// app.js处理导购逻辑
export function clearGuideData() {
  // 导购数据过期时间
  const guideExp = Taro.getStorageSync('guideExp')
  if (!guideExp || Date.parse(new Date()) - guideExp > treeDay) {
    Taro.setStorageSync('s_smid', '')
    Taro.setStorageSync('chatId', '')
    Taro.setStorageSync('s_dtid', '')
    Taro.setStorageSync('store_bn', '')
  }
  // 欢迎语导购过期时间
  const guUserIdExp = Taro.getStorageSync('guUserIdExp')
  if (!guUserIdExp || Date.parse(new Date()) - guUserIdExp > treeDay) {
    Taro.setStorageSync('work_userid', '')
  }

  // 客户群发渠道过期时间
  const channelIdExp = Taro.getStorageSync('channelIdExp')
  if (!channelIdExp || Date.parse(new Date()) - channelIdExp > treeDay) {
    Taro.setStorageSync('channel_id', '')
  }
}

// app.js处理导购逻辑
export async function guHandle(query) {
  console.log('guHandle:query', query)
  // 初始化清楚s_smid
  Taro.setStorageSync('s_smid', '')
  Taro.setStorageSync('s_dtid', '')
  Taro.setStorageSync('gu_user_id', '')
  if ((query && query.scene) || query.gu_user_id || query.smid || query.channelid) {
    const {
      smid,
      dtid,
      id,
      aid,
      cid,
      gu,
      chatId,
      gu_user_id = '',
      channelid
    } = await normalizeQuerys(query)
    // 客户群发渠道存放
    if (channelid) {
      Taro.setStorageSync('channel_id', channelid)
      Taro.setStorageSync('channelIdExp', Date.parse(new Date()))
    }
    // 旧导购存放
    if (smid) {
      Taro.setStorageSync('s_smid', smid)
    }
    if (dtid) {
      Taro.setStorageSync('s_dtid', dtid)
    }
    // 新导购埋点数据存储导购员工工号
    if (gu) {
      const [employee_number, store_bn] = gu.split('_')
      Taro.setStorageSync('work_userid', employee_number)
      Taro.setStorageSync('store_bn', store_bn)
    }
    // 欢迎语小程序卡片分享参数处理
    if (gu_user_id) {
      Taro.setStorageSync('work_userid', gu_user_id)
      Taro.setStorageSync('gu_user_id', gu_user_id)
      // 如果是登录状态下打开分享且携带导购ID
      if (S.getAuthToken()) {
        api.user.bindSaleperson({
          work_userid: gu_user_id
        })
      }
    }

    if (Taro.getStorageSync('work_userid') && S.getAuthToken()) {
      // uv 埋点
      api.user.uniquevisito({
        work_userid: Taro.getStorageSync('work_userid')
      })
    }
    // 存储群id
    if (chatId) {
      Taro.setStorageSync('chatId', chatId)
    }
    // 设置保存时间
    if (chatId || smid || gu) {
      Taro.setStorageSync('guideExp', Date.parse(new Date()))
    }
    if (gu_user_id) {
      Taro.setStorageSync('guUserIdExp', Date.parse(new Date()))
    }
    // 如果id、aid、cid同时存在则为团购分享详情
    if (id && aid && cid) {
      Taro.redirectTo({
        url: `/groupBy/pages/shareDetail/index?aid=${aid}&itemId=${id}&cid=${cid}`
      })
    }
  }
}

// entry.js处理导购逻辑
export async function entryGuHandler(options = {}, data) {
  let emp_id = options.emp_id || data.emp_id || options.emp || data.emp //导购ID
  let gu = options.gu
  let share_chatId = options.share_chatId
  let entrySource = options.entrySource
  let entrytime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000 //过期时间
  if (emp_id) {
    if (emp_id !== 'undefined' && emp_id !== '') {
      console.log('emp_id---9999', emp_id)

      Taro.setStorageSync('caodongParams', {
        emp: emp_id,
        entrytime: entrytime
      })

      if (Taro.getStorageSync('auth_token')) {
        api.track.salesmenlog({ omc_id: emp_id })
      }
    }
  }
  if (gu) {
    let guide_p = gu.split('_')
    let guide_code = guide_p[0]
    let store_code = guide_p[1]
    await S.delete('ba_params', true) //删除缓存的导购信息，新的进行替换
    await S.delete('qw_chatId', true) //删除缓存的企业微信群id，新的进行替换
    await S.delete('share_chat', true) //删除缓存的分享群id，新的进行替换
    await S.delete('entry_source', true) //删除缓存的导购入口来源，新的进行替换
    let ba_info = null
    if (share_chatId) {
      S.set(
        'share_chat',
        {
          share_chatId,
          entrytime
        },
        true
      )
    }
    if (entrySource) {
      S.set(
        'entry_source',
        {
          entrySource,
          entrytime
        },
        true
      )
    }
    S.set(
      'ba_params',
      {
        //缓存c端的导购信息，c端的导购信息有过期时间7天
        guide_code,
        store_code,
        ba_info,
        entrytime
      },
      true
    )
  }
}
