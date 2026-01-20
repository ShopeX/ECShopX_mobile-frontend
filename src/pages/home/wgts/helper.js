/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
// import { WGTS_NAV_MAP } from '@/consts'

export function linkPage(type, data) {
  const { id, title, distributor_id } = data
  let url = ''

  switch (type) {
    case 'goods':
      url = '/pages/item/espier-detail?id=' + id
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
 * 处理 outerMargin，转换为样式对象
 * @param {Object} outerMargin - 外边距配置对象（可能包含背景配置）
 * @param {number} outerMargin.paddedt - 上边距（单位：rpx）
 * @param {number} outerMargin.paddedb - 下边距（单位：rpx）
 * @param {number} outerMargin.paddedl - 左边距（单位：rpx）
 * @param {number} outerMargin.paddedr - 右边距（单位：rpx）
 * @param {string} outerMargin.bgType - 背景类型：'color' | 'pic' | 'gradient'
 * @param {string} outerMargin.bgColor - 背景颜色（bgType为'color'时使用）
 * @param {string} outerMargin.bgPic - 背景图片URL（bgType为'pic'时使用）
 * @param {string} outerMargin.startColor - 渐变起始颜色（bgType为'gradient'时使用）
 * @param {string} outerMargin.endColor - 渐变结束颜色（bgType为'gradient'时使用）
 * @returns {Object} 样式对象，包含 padding 和 background 相关样式
 */
export function getOuterMarginStyle(outerMargin) {
  if (!outerMargin || typeof outerMargin !== 'object') {
    return {}
  }

  const style = {}
  
  // 处理边距
  if (outerMargin.paddedt !== undefined && outerMargin.paddedt !== null) {
    style.paddingTop = Taro.pxTransform(outerMargin.paddedt)
  }
  
  if (outerMargin.paddedb !== undefined && outerMargin.paddedb !== null) {
    style.paddingBottom = Taro.pxTransform(outerMargin.paddedb)
  }
  
  if (outerMargin.paddedl !== undefined && outerMargin.paddedl !== null) {
    style.paddingLeft = Taro.pxTransform(outerMargin.paddedl)
  }
  
  if (outerMargin.paddedr !== undefined && outerMargin.paddedr !== null) {
    style.paddingRight = Taro.pxTransform(outerMargin.paddedr)
  }

  // 处理背景
  const bgType = outerMargin.bgType
  if (bgType === 'color' && outerMargin.bgColor) {
    style.backgroundColor = outerMargin.bgColor
  } else if (bgType === 'pic' && outerMargin.bgPic) {
    style.backgroundImage = `url(${outerMargin.bgPic})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
    style.backgroundRepeat = 'no-repeat'
  } else if (bgType === 'gradient' && outerMargin.startColor) {
    // 如果 endColor 为空，使用 startColor 作为结束颜色（单色渐变）
    const endColor = outerMargin.endColor || outerMargin.startColor
    style.backgroundImage = `linear-gradient(${outerMargin.startColor}, ${endColor})`
    style.backgroundSize = 'cover'
  }

  return style
}

/**
 * 处理 outerBackground，转换为样式对象
 * @param {Object} outerBackground - 外层背景配置对象
 * @param {string} outerBackground.color - 背景颜色
 * @param {string} outerBackground.image - 背景图片URL
 * @returns {Object} 样式对象，包含背景相关样式
 */
export function getOuterBackgroundStyle(outerBackground) {
  if (!outerBackground || typeof outerBackground !== 'object') {
    return {}
  }

  const style = {}
  
  if (outerBackground.color) {
    style.backgroundColor = outerBackground.color
  }
  
  if (outerBackground.image) {
    style.backgroundImage = `url(${outerBackground.image})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
    style.backgroundRepeat = 'no-repeat'
  }

  return style
}

/**
 * 处理 innerPadding，转换为样式对象
 * @param {Object} innerPadding - 内边距配置对象
 * @param {number} innerPadding.paddedt - 上边距（单位：rpx）
 * @param {number} innerPadding.paddedb - 下边距（单位：rpx）
 * @param {number} innerPadding.paddedl - 左边距（单位：rpx）
 * @param {number} innerPadding.paddedr - 右边距（单位：rpx）
 * @returns {Object} 样式对象，包含 paddingTop, paddingBottom, paddingLeft, paddingRight
 */
export function getInnerPaddingStyle(innerPadding) {
  if (!innerPadding || typeof innerPadding !== 'object') {
    return {}
  }

  const style = {}
  
  if (innerPadding.paddedt !== undefined && innerPadding.paddedt !== null) {
    style.paddingTop = Taro.pxTransform(innerPadding.paddedt)
  }
  
  if (innerPadding.paddedb !== undefined && innerPadding.paddedb !== null) {
    style.paddingBottom = Taro.pxTransform(innerPadding.paddedb)
  }
  
  if (innerPadding.paddedl !== undefined && innerPadding.paddedl !== null) {
    style.paddingLeft = Taro.pxTransform(innerPadding.paddedl)
  }
  
  if (innerPadding.paddedr !== undefined && innerPadding.paddedr !== null) {
    style.paddingRight = Taro.pxTransform(innerPadding.paddedr)
  }

  return style
}

/**
 * 处理 innerBackground，转换为样式对象
 * @param {Object} innerBackground - 内层背景配置对象
 * @param {string} innerBackground.type - 背景类型：'solid' | 'gradient'
 * @param {string} innerBackground.color - 背景颜色（solid类型）
 * @param {string} innerBackground.startColor - 渐变起始颜色（gradient类型）
 * @param {string} innerBackground.endColor - 渐变结束颜色（gradient类型）
 * @returns {Object} 样式对象，包含背景相关样式
 */
export function getInnerBackgroundStyle(innerBackground) {
  if (!innerBackground || typeof innerBackground !== 'object') {
    return {}
  }

  const style = {}
  
  if (innerBackground.type === 'solid' && innerBackground.color) {
    style.backgroundColor = innerBackground.color
  } else if (innerBackground.type === 'gradient' && innerBackground.startColor && innerBackground.endColor) {
    style.backgroundImage = `linear-gradient(${innerBackground.startColor}, ${innerBackground.endColor})`
  }

  return style
}

/**
 * 获取完整的 base 样式（包含 outerMargin 和 outerBackground）
 * @param {Object} base - base 配置对象
 * @returns {Object} 合并后的样式对象
 */
export function getBaseOuterStyle(base) {
  console.log('base', base)
  if (!base || typeof base !== 'object') {
    return {}
  }

  // outerMargin 现在可能包含背景配置，所以先处理 outerMargin
  const outerMarginStyle = getOuterMarginStyle(base.outerMargin)
  
  // 如果 outerMargin 中没有背景配置，再尝试从 outerBackground 获取
  // 但优先使用 outerMargin 中的背景配置
  const outerBackgroundStyle = getOuterBackgroundStyle(base.outerBackground)
  
  // 合并样式，outerMargin 的样式优先级更高
  return {
    ...outerBackgroundStyle,
    ...outerMarginStyle
  }
}

/**
 * 获取完整的 base 内层样式（包含 innerPadding 和 innerBackground）
 * @param {Object} base - base 配置对象
 * @returns {Object} 合并后的样式对象
 */
export function getBaseInnerStyle(base) {
  if (!base || typeof base !== 'object') {
    return {}
  }

  return {
    ...getInnerPaddingStyle(base.innerPadding),
    ...getInnerBackgroundStyle(base.innerBackground)
  }
}

export default {}
