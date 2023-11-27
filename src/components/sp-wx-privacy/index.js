let privacyHandler
let privacyResolves = new Set()
let closeOtherPagePopUpHooks = new Set()

if (wx.onNeedPrivacyAuthorization) {
  wx.onNeedPrivacyAuthorization(resolve => {
    console.log('onNeedPrivacyAuthorization...', resolve)
    if (typeof privacyHandler === 'function') {
      privacyHandler(resolve)
    }
  })
}

const closeOtherPagePopUp = (closePopUp) => {
  closeOtherPagePopUpHooks.forEach(hook => {
    if (closePopUp !== hook) {
      hook()
    }
  })
}

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    title: "用户隐私保护提示",
    urlTitle: "《用户隐私保护指引》",
    innerShow: false
  },
  lifetimes: {
    attached: function () {
      const closePopUp = () => {
        this.disPopUp()
      }

      privacyHandler = resolve => {
        privacyResolves.add(resolve)
        this.popUp()
        // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
        closeOtherPagePopUp(closePopUp)
      }

      closeOtherPagePopUpHooks.add(closePopUp)

      this.closePopUp = closePopUp

      wx.getPrivacySetting({
        success: res => {
          const { privacyContractName } = res
          this.setData({
            urlTitle: privacyContractName
          })
        },
        fail: (e) => {
          console.log('getPrivacySetting err:', e)
        },
        complete: () => { }
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
      privacyResolves.forEach(resolve => {
        resolve({
          event: 'agree',
          buttonId: 'agree-btn'
        })
      })
      privacyResolves.clear()
    },
    handleDisagree(e) {
      this.disPopUp()
      privacyResolves.forEach(resolve => {
        resolve({
          event: 'disagree',
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
        success: res => {
          console.log('openPrivacyContract success')
        },
        fail: res => {
          console.error('openPrivacyContract fail', res)
        }
      })
    }
  }
})
