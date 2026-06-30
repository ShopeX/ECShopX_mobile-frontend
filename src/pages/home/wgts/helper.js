/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { isWeb } from '@/utils'
// import { WGTS_NAV_MAP } from '@/consts'

/** 配置里可能是数字或字符串，保证 pxTransform 入参为数字 */
function toDesignPx(val) {
  if (val === undefined || val === null || val === '') return null
  const n = Number(val)
  return Number.isFinite(n) ? n : null
}

export function linkPage(type, data) {
  const { id, title, distributor_id } = data
  let url = ''

  switch (type) {
    case 'goods':
      url = '/subpages/item/espier-detail?id=' + id
      break
    case 'category':
      url = '/subpages/item/list?cat_id=' + id
      break
    case 'article':
      url = '/pages/article/index?id=' + id
      break
    case 'planting':
      url = '/pages/recommend/detail?id=' + id
      break
    case 'custom_page':
      url = '/pages/custom/custom-page?id=' + id
      break
    case 'marketing':
      if (id == 'coupon_list') {
        url = '/subpages/marketing/coupon-center'
      } else if (id == 'my_coupon') {
        url = '/subpages/marketing/coupon'
      } else if (id == 'groups_list') {
        url = '/marketing/pages/item/group-list'
      }
      break
    case 'seckill':
      url = '/marketing/pages/item/seckill-goods-list?seckill_id=' + id
      break
    case 'link':
      if (id == 'vipgrades') {
        url = '/subpage/pages/vip/vipgrades'
      } else if (id == 'serviceH5Coach') {
        url = '/marketing/pages/service/wap-link?tp=o'
      } else if (id == 'serviceH5Sales') {
        url = '/marketing/pages/service/wap-link?tp=r'
      } else if (id == 'storelist') {
        url = '/marketing/pages/service/store-list'
      } else if (id == 'aftersales') {
        url = '/marketing/pages/service/refund-car'
      } else if (id == 'mycoach') {
        url = '/marketing/pages/service/online-guide'
      } else if (id == 'hottopic') {
        url = '/pages/recommend/list'
      } else if (id === 'floorguide') {
        url = '/pages/floorguide/index'
      } else if (id === 'grouppurchase') {
        url = '/groupBy/pages/home/index'
      } else {
        url = ''
      }
      break
    case 'tag':
      url = '/subpages/item/list?tag_id=' + id
      break
    case 'regactivity':
      url = '/marketing/pages/reservation/goods-reservate?activity_id=' + id
      break
    case 'liverooms':
      url = 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + id
      break
    case 'store':
      url = `/subpages/store/index?id=${id}`
      break
    case 'custom':
      url = id
      break
    case 'liverooms':
      url = 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + id
      break
    default:
  }

  if (id === 'pointitems') {
    url = '/subpages/pointshop/list'
  }

  if (id == 'applyChief') {
    url = `/subpages/community/apply-chief?distributor_id=${distributor_id}`
  }

  if (type === 'other_wxapp') {
    Taro.navigateToMiniProgram({
      appId: id,
      path: title
    })
  } else {
    Taro.navigateTo({
      url
    })
  }
}

/**
 * 处理 baseStyle，转换为样式对象
 * @param {Object} baseStyle - 外边距配置对象（可能包含背景配置）
 * @param {number} baseStyle.paddedt - 上边距（单位：rpx）
 * @param {number} baseStyle.paddedb - 下边距（单位：rpx）
 * @param {number} baseStyle.paddedl - 左边距（单位：rpx）
 * @param {number} baseStyle.paddedr - 右边距（单位：rpx）
 * @param {string} baseStyle.bgType - 背景类型：'color' | 'pic' | 'gradient'
 * @param {string} baseStyle.bgColor - 背景颜色（bgType为'color'时使用）
 * @param {string} baseStyle.bgPic - 背景图片URL（bgType为'pic'时使用）
 * @param {string} baseStyle.startColor - 渐变起始颜色（bgType为'gradient'时使用）
 * @param {string} baseStyle.endColor - 渐变结束颜色（bgType为'gradient'时使用）
 * @returns {Object} 样式对象，包含 padding 和 background 相关样式
 */
export function getGlobalBaseStyle(baseStyle) {
  if (!baseStyle || typeof baseStyle !== 'object') {
    return {}
  }

  const bgType = baseStyle.bgType
  const style = {}
  style.padding = `${Taro.pxTransform(baseStyle.paddedt || 0)} ${Taro.pxTransform(baseStyle.paddedr || 0)} ${Taro.pxTransform(baseStyle.paddedb || 0)} ${Taro.pxTransform(baseStyle.paddedl || 0)}`
  if (bgType === 'color' && baseStyle.bgColor) {
    if(isWeb){
      style['background-color'] = baseStyle.bgColor
    } else {
      style.backgroundColor = baseStyle.bgColor
    }
  } else if (bgType === 'pic' && baseStyle.bgPic) {
    if(isWeb){
      style['background-image'] = `url('${baseStyle.bgPic}')`
      style['background-size'] = '100% 100%'
      style['background-position'] = 'center'
      style['background-repeat'] = 'no-repeat'
    } else {
    style.backgroundImage = `url('${baseStyle.bgPic}')`
    style.backgroundSize = '100% 100%'
    style.backgroundPosition = 'center'
    style.backgroundRepeat = 'no-repeat'
    }
  } else if (bgType === 'gradient' && baseStyle.startColor) {
    const endColor = baseStyle.endColor || baseStyle.startColor
    if(isWeb){
      style['background-image'] = `linear-gradient(${baseStyle.startColor}, ${endColor})`
      style['background-size'] = 'cover'
    } else {
      style.backgroundImage = `linear-gradient(${baseStyle.startColor}, ${endColor})`
      style.backgroundSize = 'cover'
    }
  }
  return style
}

/**
 * 获取完整的 base 样式（直接使用 getbaseStyleStyle）
 * @param {Object} baseStyle - baseStyle 或 innerPadding 配置对象
 * @returns {Object} 样式对象
 */

export default {}
