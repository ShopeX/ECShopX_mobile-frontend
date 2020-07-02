/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/groupBy/utils/index.js
 * @Date: 2020-06-12 18:14:20
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-23 13:46:22
 */


const formatGood = (data, symbol = '¥') => {
  if (!data || !data.length) {
    return []
  }
  const list = data.map(item => {
    return {
      symbol,
      itemId: item.item_id,
      cartId: item.cart_id,
      store: item.store,
      itemName: item.item_name,
      history_data: item.history_data || [],
      initial_sales: item.initial_sales || 0,
      brief: item.brief,
      pics: Array.isArray(item.pics) ? item.pics[0] : item.pics,
      pic: item.pic,
      activity_id: item.activity_id,
      isChecked: item.is_checked || false,
      num: item.cart_num || item.num,
      limit_num: item.limit_num,
      itemPrice: (item.price / 100).toFixed(2),
      totalFee: (item.total_fee / 100).toFixed(2),
      price: (item.activity_price / 100).toFixed(2),
      activity_price: (item.activity_price / 100).toFixed(2)
    }
  })
  return list
}

const formatOrder = (data) => {
  if (!data || !data.length) {
    return []
  }
  const list = data.map(item => {
    return {
      orderId: item.order_id,
      items: formatGood(item.items, item.fee_symbol),
      symbol: item.fee_symbol,
      orderStatus: item.order_status,
      orderStatusMsg: item.order_status_msg
    }
  })
  return list
}

// 格式化时间
const formatCountTime = (time) => {
  const format = (val) => (val > 9) ? val : `0${val}`
  const d = Math.floor(time / (24*3600))
  const h = Math.floor(time % (24*3600) / 3600)
  const m = Math.floor(time % 3600 / 60)
  const s = Math.floor(time % 60)
  return `${d}天${format(h)}:${format(m)}:${format(s)}`
}

export {
  formatGood,
  formatOrder,
  formatCountTime
}