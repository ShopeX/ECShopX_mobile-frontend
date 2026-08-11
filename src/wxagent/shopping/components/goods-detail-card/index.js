/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子组件：商品详情卡片。承接 getGoodsDetail 的 structuredContent。
 * 无规格商品：点击「立即购买」-> 上行并指定下一步 createOrder。
 * 有规格商品：点击「选规格购买」-> 引导用户在对话里说明规格（由模型继续）。
 */
Component({
  data: {
    itemId: '',
    title: '',
    image: '',
    price: null,
    marketPrice: null,
    store: null,
    hasSku: false
  },
  lifetimes: {
    created: function () {
      var self = this
      var modelCtx = wx.modelContext.getContext(this)
      var NotificationType = wx.modelContext.NotificationType
      this._modelCtx = modelCtx
      this._viewCtx = wx.modelContext.getViewContext(this)
      modelCtx.on(NotificationType.Result, function (data) {
        var sc = (data && data.result && data.result.structuredContent) || {}
        self.setData({
          itemId: sc.itemId || '',
          title: sc.title || '',
          image: sc.image || '',
          price: sc.price != null ? sc.price : null,
          marketPrice: sc.marketPrice != null ? sc.marketPrice : null,
          store: sc.store != null ? sc.store : null,
          hasSku: !!sc.hasSku
        })
        // 卡片右上角「进入小程序」指向真实商品详情页：有规格商品可在原生页选规格下单
        if (sc.itemId) {
          var query = 'id=' + sc.itemId
          if (sc.distributorId != null) query += '&dtid=' + sc.distributorId
          self._viewCtx.setRelatedPage({ path: '/subpages/item/espier-detail', query: query })
        }
      })
    }
  },
  methods: {
    onBuy: function () {
      if (!this._modelCtx) return
      if (this.data.hasSku) {
        this._modelCtx.sendFollowUpMessage({
          content: [{ type: 'text', text: '这款「' + this.data.title + '」我想买，请帮我选规格' }]
        })
        return
      }
      this._modelCtx.sendFollowUpMessage({
        content: [
          { type: 'text', text: '我要买「' + this.data.title + '」1 件' },
          {
            type: 'api/call',
            data: { name: 'createOrder', arguments: { itemId: this.data.itemId, num: 1 } }
          }
        ]
      })
    }
  }
})
