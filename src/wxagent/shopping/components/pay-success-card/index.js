/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子组件：支付成功卡片。承接 payOrder 的 structuredContent。
 */
Component({
  data: {
    orderId: '',
    paidAmount: null,
    payTimeText: ''
  },
  lifetimes: {
    created: function () {
      var self = this
      var modelCtx = wx.modelContext.getContext(this)
      var NotificationType = wx.modelContext.NotificationType
      modelCtx.on(NotificationType.Result, function (data) {
        var sc = (data && data.result && data.result.structuredContent) || {}
        var timeText = ''
        if (sc.payTime) {
          try {
            var t = new Date(sc.payTime)
            var pad = function (n) {
              return n < 10 ? '0' + n : '' + n
            }
            timeText = pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds())
          } catch (e) {
            timeText = ''
          }
        }
        self.setData({
          orderId: sc.orderId || '',
          paidAmount: sc.paidAmount != null ? sc.paidAmount : null,
          payTimeText: timeText
        })
      })
    }
  }
})
