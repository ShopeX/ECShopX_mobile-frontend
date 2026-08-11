/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子组件：商品列表卡片。承接 searchGoods 的 structuredContent。
 * 点击某商品 -> 代用户上行「查看XX」并指定下一步调用 getGoodsDetail。
 */
Component({
  data: {
    keyword: '',
    goods: []
  },
  lifetimes: {
    created: function () {
      var self = this
      var modelCtx = wx.modelContext.getContext(this)
      var NotificationType = wx.modelContext.NotificationType
      this._modelCtx = modelCtx
      modelCtx.on(NotificationType.Result, function (data) {
        var sc = (data && data.result && data.result.structuredContent) || {}
        self.setData({ keyword: sc.keyword || '', goods: sc.goods || [] })
      })
    }
  },
  methods: {
    onTapGoods: function (e) {
      var ds = e.currentTarget.dataset
      if (!this._modelCtx) return
      this._modelCtx.sendFollowUpMessage({
        content: [
          { type: 'text', text: '我想看看「' + (ds.title || '') + '」的详情' },
          { type: 'api/call', data: { name: 'getGoodsDetail', arguments: { itemId: ds.itemid } } }
        ]
      })
    }
  }
})
