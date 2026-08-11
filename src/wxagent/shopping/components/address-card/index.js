/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子组件：收货地址卡片。承接 listAddresses 的 structuredContent。
 * 点击某地址 -> 代用户上行「使用该地址」，把 addressId 交回给模型继续流程。
 */
Component({
  data: {
    addresses: []
  },
  lifetimes: {
    created: function () {
      var self = this
      var modelCtx = wx.modelContext.getContext(this)
      var NotificationType = wx.modelContext.NotificationType
      this._modelCtx = modelCtx
      modelCtx.on(NotificationType.Result, function (data) {
        var sc = (data && data.result && data.result.structuredContent) || {}
        var list = (sc.addresses || []).map(function (a) {
          return {
            addressId: a.addressId,
            name: a.name,
            mobile: a.mobile,
            detail: a.detail,
            isDefault: a.isDefault,
            region: (a.province || '') + (a.city || '') + (a.county || '')
          }
        })
        self.setData({ addresses: list })
      })
    }
  },
  methods: {
    onTapAddr: function (e) {
      var ds = e.currentTarget.dataset
      if (!this._modelCtx) return
      var summary = (ds.name || '') + ' ' + (ds.region || '') + (ds.detail || '')
      this._modelCtx.sendFollowUpMessage({
        content: [
          { type: 'text', text: '用这个收货地址：' + summary + '（addressId=' + ds.addressid + '）' }
        ]
      })
    }
  }
})
