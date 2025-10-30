// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
let privacyHandler
let privacyResolves = new Set()
let closeOtherPagePopUpHooks = new Set()

if (wx.onNeedPrivacyAuthorization) {
  wx.onNeedPrivacyAuthorization((resolve) => {
    console.log('onNeedPrivacyAuthorization...', resolve)
    if (typeof privacyHandler === 'function') {
      privacyHandler(resolve)
    }
  })
}

const closeOtherPagePopUp = (closePopUp) => {
  closeOtherPagePopUpHooks.forEach((hook) => {
    if (closePopUp !== hook) {
      hook()
    }
  })
}

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    title: '用户隐私保护提示',
    urlTitle: '《用户隐私保护指引》',
    innerShow: false
  },
  lifetimes: {
    attached: function () {
      const closePopUp = () => {
        this.disPopUp()
      }

      privacyHandler = (resolve) => {
        privacyResolves.add(resolve)
        this.popUp()
        // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
        closeOtherPagePopUp(closePopUp)
      }

      closeOtherPagePopUpHooks.add(closePopUp)

      this.closePopUp = closePopUp

      wx.getPrivacySetting({
        success: (res) => {
          const { privacyContractName } = res
          this.setData({
            urlTitle: privacyContractName
          })
        },
        fail: (e) => {
          console.log('getPrivacySetting err:', e)
        },
        complete: () => {}
      })
    },
    detached: function () {
      closeOtherPagePopUpHooks.delete(this.closePopUp)
    }
  },
  methods: {
    handleAgree(e) {
      console.log('handleAgree:', e)
      this.disPopUp()
      privacyResolves.forEach((resolve) => {
        resolve({
          event: 'agree',
          buttonId: 'agree-btn'
        })
      })
      privacyResolves.clear()
    },
    handleDisagree(e) {
      this.disPopUp()
      privacyResolves.forEach((resolve) => {
        resolve({
          event: 'disagree'
        })
      })
      privacyResolves.clear()
    },
    popUp() {
      if (this.data.innerShow === false) {
        this.setData({
          innerShow: true
        })
      }
    },
    disPopUp() {
      if (this.data.innerShow === true) {
        this.setData({
          innerShow: false
        })
      }
    },
    openPrivacyContract() {
      wx.openPrivacyContract({
        success: (res) => {
          console.log('openPrivacyContract success')
        },
        fail: (res) => {
          console.error('openPrivacyContract fail', res)
        }
      })
    }
  }
})
