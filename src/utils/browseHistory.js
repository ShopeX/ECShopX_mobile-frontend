/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 * 本地浏览记录：进入商品详情页时写入，最多 10 条；挂件 history 类型从此读取。
 */
import Taro from '@tarojs/taro'
import { SG_BROWSE_HISTORY_ITEMS } from '@/consts/localstorage'

const MAX_BROWSE_HISTORY = 10

/**
 * 保存一条浏览记录（进入商品详情页时调用）
 * @param {Object} item - 商品信息，需含 item_id/distributor_id/item_name/pics 或 img/price(元)/market_price(元)/store 等
 */
export function saveBrowseItem(item) {
  if (!item || (item.item_id == null && item.itemId == null)) return
  const itemId = item.item_id ?? item.itemId
  const raw = Taro.getStorageSync(SG_BROWSE_HISTORY_ITEMS)
  let list = Array.isArray(raw) ? raw : []
  // 存为挂件可用的结构：价格用分，字段与 WGT_SPEEDKILL_GOODS 一致
  const record = {
    item_id: itemId,
    goods_id: item.goods_id ?? itemId,
    distributor_id: item.distributor_id ?? item.distributorId,
    item_name: item.item_name ?? item.itemName,
    pics: item.pics ?? (item.imgs ? [item.imgs].flat() : []),
    main_img:
      item.main_img ??
      item.img ??
      (item.pics && item.pics[0]) ??
      (item.imgs && (Array.isArray(item.imgs) ? item.imgs[0] : item.imgs)),
    price: typeof item.price === 'number' ? Math.round(item.price * 100) : item.price ?? 0,
    market_price:
      typeof item.marketPrice === 'number'
        ? Math.round(item.marketPrice * 100)
        : typeof item.market_price === 'number'
        ? item.market_price
        : 0,
    activity_price:
      item.activityPrice != null
        ? Math.round(Number(item.activityPrice) * 100)
        : item.activity_price ?? undefined,
    store: item.store ?? 0,
    promotion_activity: item.promotion_activity,
    kaquan_list: item.kaquan_list ?? item.couponList,
    memberpreference_activity: item.memberpreference_activity
  }
  list = list.filter((i) => (i.item_id ?? i.itemId) !== itemId)
  list.unshift(record)
  list = list.slice(0, MAX_BROWSE_HISTORY)
  Taro.setStorageSync(SG_BROWSE_HISTORY_ITEMS, list)
}

/**
 * 获取本地浏览记录列表，最多 maxCount 条
 * @param {number} maxCount - 最大条数，默认 10
 * @returns {Array}
 */
export function getBrowseHistoryList(maxCount = MAX_BROWSE_HISTORY) {
  const raw = Taro.getStorageSync(SG_BROWSE_HISTORY_ITEMS)
  const list = Array.isArray(raw) ? raw : []
  return list.slice(0, maxCount)
}
