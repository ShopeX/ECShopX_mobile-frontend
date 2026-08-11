/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子组件：订单确认卡片。承接 createOrder 的 structuredContent + _meta。
 * 订单已在服务端创建（含 orderId），点击「确认支付」-> 上行并指定下一步 payOrder，
 * 由 payOrder 原子接口在客户端运行时调用 wx.requestPayment 拉起微信收银台。
 */
Component({
  data: {
    orderId: '',
    title: '',
    image: '',
    num: 1,
    amount: null,
    addressText: '',
    payType: '',
    payChannel: ''
  },
  lifetimes: {
    created: function () {
      var self = this
      var modelCtx = wx.modelContext.getContext(this)
      var NotificationType = wx.modelContext.NotificationType
      this._modelCtx = modelCtx
      modelCtx.on(NotificationType.Result, function (data) {
        var result = (data && data.result) || {}
        var sc = result.structuredContent || {}
        var meta = result._meta || {}
        self.setData({
          orderId: sc.orderId || '',
          title: sc.title || '',
          image: meta.image || '',
          num: sc.num || 1,
          amount: sc.amount != null ? sc.amount : null,
          addressText: sc.addressText || '',
          payType: meta.payType || '',
          payChannel: meta.payChannel || ''
        })
      })
    }
  },
  methods: {
    onPay: function () {
      if (!this._modelCtx || !this.data.orderId) return
      this._modelCtx.sendFollowUpMessage({
        content: [
          { type: 'text', text: '确认支付' },
          {
            type: 'api/call',
            data: {
              name: 'payOrder',
              arguments: {
                orderId: this.data.orderId,
                amount: this.data.amount,
                title: this.data.title,
                payType: this.data.payType,
                payChannel: this.data.payChannel
              }
            }
          }
        ]
      })
    }
  }
})
