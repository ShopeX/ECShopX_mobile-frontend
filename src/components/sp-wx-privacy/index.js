/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import i18n, { $t } from '@/i18n'

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

const getPrivacyTextData = () => ({
  title: $t('42a6f4da.9184c0'),
  privacyTips1: $t('42a6f4da.6671f3'),
  privacyTips2: $t('42a6f4da.e72805'),
  urlTitle: $t('42a6f4da.67c249'),
  btnReject: $t('7c40f12d.7173f8'),
  btnAgree: $t('ed40c676.e61f2c')
})

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    title: '',
    privacyTips1: '',
    privacyTips2: '',
    urlTitle: '',
    btnReject: '',
    btnAgree: '',
    innerShow: false
  },
  lifetimes: {
    attached: function () {
      this.updateI18nText = () => {
        this.setData(getPrivacyTextData())
      }
      this.updateI18nText()
      i18n.on('languageChanged', this.updateI18nText)

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
      if (this.updateI18nText) {
        i18n.off('languageChanged', this.updateI18nText)
      }
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
