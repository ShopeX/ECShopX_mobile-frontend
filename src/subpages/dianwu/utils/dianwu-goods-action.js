/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

/** 商品开启店铺库存（店铺发货） */
export function isDianwuStoreInventoryEnabled(item) {
  const v = item?.isTotalStore
  return v === false || v === 0 || v === '0' || v === 'false'
}

function toStockNum(val) {
  const n = Number(val)
  return Number.isFinite(n) ? n : 0
}

function resolvePlatformStockNum(item) {
  if (item?.platformStore == null || item.platformStore === '') {
    return null
  }
  return toStockNum(item.platformStore)
}

/**
 * @param {object} item pickBy(GOODS_ITEM)
 * @param {boolean} isPlatformStoreBuy 门店 is_platform_store_buy
 */
export function resolveDianwuGoodsDisplay(item, isPlatformStoreBuy) {
  const storeStock = toStockNum(item?.store)
  const platformStock = resolvePlatformStockNum(item)
  const storeInventoryEnabled = isDianwuStoreInventoryEnabled(item)

  if (isPlatformStoreBuy) {
    if (storeInventoryEnabled) {
      return {
        showStore: true,
        showCloud: platformStock != null,
        storeValue: storeStock,
        cloudValue: platformStock != null ? platformStock : 0
      }
    }
    return {
      showStore: false,
      showCloud: true,
      storeValue: 0,
      cloudValue: platformStock != null ? platformStock : storeStock
    }
  }

  if (storeInventoryEnabled) {
    return {
      showStore: true,
      showCloud: false,
      storeValue: storeStock,
      cloudValue: 0
    }
  }

  return {
    showStore: false,
    showCloud: true,
    storeValue: 0,
    cloudValue: storeStock
  }
}

/**
 * @param {object} item
 * @param {boolean} isPlatformStoreBuy
 */
export function resolveDianwuGoodsActions(item, isPlatformStoreBuy) {
  const storeStock = toStockNum(item?.store)
  const platformStock = resolvePlatformStockNum(item)
  const storeInventoryEnabled = isDianwuStoreInventoryEnabled(item)

  let addToCashier = false
  let buyNow = false

  if (isPlatformStoreBuy) {
    if (storeInventoryEnabled) {
      if (storeStock > 0) {
        addToCashier = true
      } else if (platformStock != null && platformStock > 0) {
        buyNow = true
      }
    } else if (platformStock != null && platformStock > 0) {
      buyNow = true
    }
  } else if (storeInventoryEnabled) {
    if (storeStock > 0) {
      addToCashier = true
    }
  } else if (storeStock > 0) {
    buyNow = true
  }

  return { addToCashier, buyNow }
}

/**
 * @param {object} item
 * @param {boolean} isPlatformStoreBuy
 */
export function isDianwuGoodsDisabled(item, isPlatformStoreBuy) {
  const { addToCashier, buyNow } = resolveDianwuGoodsActions(item, isPlatformStoreBuy)
  return !addToCashier && !buyNow
}
