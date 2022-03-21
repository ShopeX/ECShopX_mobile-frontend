import log, { showToast } from './utils'

class MAPP {
  constructor() {
    if (!MAPP.instance) {
      this.token = localStorage.getItem('auth_token')
      this._back_first = null
      this._events = {}
      MAPP.instance = this
    }
    return MAPP.instance
  }

  init(taro, store) {
    if (taro) {
      this.Taro = taro
      this.Store = store
    } else {
      log.error('Taro is undefined, app run fail')
    }

    if (typeof plus != 'undefined') {
      this._initPlus()
    } else {
      document.addEventListener('plusready', () => {
        this._initPlus()
      })
    }
  }

  _initPlus() {
    const __SAPP_CONFIG = plus.storage.getItem('SAPP_CONFIG')
    try {
      this.SAPP_CONFIG = JSON.parse(__SAPP_CONFIG)
    } catch (e) {
      log.error('sapp config json parse error')
      return
    }

    const currentWebview = plus.webview.currentWebview()
    currentWebview.addEventListener(
      'show',
      () => {
        console.log('sp-mui-app addeventlistener show')
        //: TODO
        // this.Taro.getCurrentPages()[0].componentDidShow();
        // 合并store: todo
        // this.Store.dispatch({
        //   type: "merge",
        //   payload: JSON.parse(plus.storage.getItem("SAPP_STORE"))
        // });
      },
      false
    )

    const { singleWebview } = this.SAPP_CONFIG
    if (!singleWebview) {
      this.Taro.navigateTo = this._navigateTo.bind(this, false)
      this.Taro.redirectTo = this._navigateTo.bind(this, true)
      this.Taro.navigateBack = this._navigateBack.bind(this)
      console.log(this.Store)
      // 预加载底部tabbar页面
      this._preLoadPage()
    }

    // plus.navigator.setStatusBarStyle("light")

    // this.Taro.getEnv = this._getEnv.bind(this)
    log.info(
      `sp-mui-app script load success, current webview is ${
        singleWebview ? 'single' : 'multiple'
      } modes`
    )

    // 按键返回监听
    plus.key.addEventListener('backbutton', this._navigateBack.bind(this), false)

    // 订阅store
    this.Store.subscribe(() => {
      console.log(this.Store.getState())
      console.log('store change....')
      const _sappStore = plus.storage.getItem('SAPP_STORE')
      const localStore = _sappStore ? JSON.parse(_sappStore) : {}
      const appStore = this.Store.getState()
      console.log('localStore', this._mergeJSON(appStore, localStore))
      //: todo
      // plus.storage.setItem(
      //   "SAPP_STORE",
      //   JSON.stringify(this._mergeJSON(appStore, localStore))
      // );
    })

    // 合并store: todo
    // this.Store.dispatch({
    //   type: "merge",
    //   payload: JSON.parse(plus.storage.getItem("SAPP_STORE"))
    // });
  }

  _mergeJSON(minor, main) {
    for (var key in minor) {
      if (main[key] === undefined) {
        main[key] = minor[key]
        continue
      }
      for (var n in minor[key]) {
        if (!main[key][n]) {
          main[key][n] = {}
        }
        Object.assign(main[key][n], minor[key][n])
      }
    }
    return main
  }

  _navigateTo(redirect, data) {
    const url = data.url
    // const params = {} || data.params
    const params = Object.assign({}, data.params)
    let animate = 'slide-in-right' || params.animate
    // let baseUrl = this._getBaseURL()
    if (this._pathIsTabbar(url)) {
      animate = 'none'
    }
    // if (!/^http|https/.test(baseUrl)) {
    //   baseUrl = "_www/dist/index.html"
    // }

    // var view = baseUrl + "#" + url
    let view = this._getPageURL(url)
    log.info('webView: ' + view)

    // 页面隐藏事件: todo
    // this.Taro.getCurrentPages()[0].componentDidHide()

    var findResult = this._findWebViewById(url.split('?')[0])

    if (findResult) {
      log.info('navigateTo: ' + findResult.id)
      if (findResult.id == this.SAPP_CONFIG.homePage) {
        plus.webview.getLaunchWebview().show()
        plus.webview.getWebviewById(this.SAPP_CONFIG.homePage).show()
      } else {
        // findResult.reload()
        findResult.show(animate)
      }
    } else {
      Object.assign(params, {
        prevPageId: plus.webview.currentWebview()[redirect ? 'prevPageId' : 'id']
      })
      var _openw = plus.webview.create(
        view,
        // 页面id不带参数
        // url.split("?")[0],
        url,
        {
          scrollIndicator: 'none',
          scalable: false,
          popGesture: 'none'
        },
        params
      )
      _openw.show(animate)
    }

    // webview 垃圾回收
    const currentWebview = plus.webview.currentWebview()
    if (redirect && !this._pathIsTabbar(currentWebview.id)) {
      currentWebview.close()
    }

    if (this._pathIsTabbar(url)) {
      log.info('this path is in tabbar')
      let ws = plus.webview.all()
      ws.forEach((w) => {
        if (!this._pathIsTabbar(w.id) && w.id != plus.webview.getLaunchWebview().id) {
          log.info('webview destroy: ' + w.id)
          w.close()
        }
      })
    }
  }

  _navigateBack() {
    const curWebView = plus.webview.currentWebview()
    curWebView.canBack((e) => {
      if (e.canBack) {
        window.history.back()
      } else {
        log.info('current webview id: ' + curWebView.id)
        if (curWebView.id === this.SAPP_CONFIG.homePage) {
          // 首页，首次按键，提示‘再按一次退出应用’
          if (!this._back_first) {
            this._back_first = new Date().getTime()
            showToast('再按一次退出应用')
            setTimeout(() => {
              this._back_first = null
            }, 2000)
          } else {
            if (new Date().getTime() - this._back_first < 2000) {
              plus.runtime.quit()
            }
          }
        } else {
          //webview close or hide
          const { prevPageId } = plus.webview.currentWebview()
          prevPageId && plus.webview.getWebviewById(prevPageId).show()
          curWebView.close()
        }
      }
    })
  }

  // 加载底部tabbar关联页面
  _preLoadPage() {
    if (this.SAPP_CONFIG.tabbar.length > 0) {
      this.SAPP_CONFIG.tabbar.forEach((item) => {
        if (!this._findWebViewById(item)) {
          console.log('proloadpage: ', item, this._getPageURL(item))
          const tabView = plus.webview.create(this._getPageURL(item), item, null)
          tabView.hide()
        }
      })
    } else {
      const { tabbar } = this.Store.getState().sys
      const { data } = tabbar
      data.forEach((item) => {
        if (!this._findWebViewById(item.pagePath.split('?')[0])) {
          console.log('proloadpage: ', item.pagePath, this._getPageURL(item))
          const tabView = plus.webview.create(
            this._getPageURL(item.pagePath),
            item.pagePath.split('?')[0],
            null
          )
          tabView.hide()
        }
      })
    }
  }

  _getEnv() {
    return 'SAPP'
  }

  _getPageURL(url) {
    let baseUrl = this._getBaseURL()
    if (!/^http|https/.test(baseUrl)) {
      baseUrl = '_www/dist/index.html'
    }

    return baseUrl + '#' + url
  }

  // 应用的首页
  _getBaseURL() {
    const { launch_path } = this.SAPP_CONFIG
    return launch_path
  }

  // 是否是底部tabbar页面
  _pathIsTabbar(url) {
    let result = null
    if (this.SAPP_CONFIG.tabbar.length > 0) {
      result = this.SAPP_CONFIG.tabbar.find(function (item) {
        return item == url
      })
    } else {
      const { tabbar } = this.Store.getState().sys
      console.log('xxx:', tabbar)
      const tabList = tabbar.data
      if (tabList) {
        result = tabList.find(function (item) {
          return item.pagePath == url.split('?')[0]
        })
      }
    }
    return result
  }

  // webview是否已经创建过
  _findWebViewById(id) {
    var all = plus.webview.all()
    var result = all.find(function (item) {
      return item.id == id
    })
    return result
  }

  // 复制到剪贴板
  copyToClip(content) {
    switch (plus.os.name) {
      case 'iOS':
        var UIPasteboard = plus.ios.importClass('UIPasteboard')
        var generalPasteboard = UIPasteboard.generalPasteboard()
        // 设置文本内容
        generalPasteboard.setValueforPasteboardType(content, 'public.utf8-plain-text')
        break
      case 'Android':
        var context = plus.android.importClass('android.content.Context')
        var main = plus.android.runtimeMainActivity()
        var clip = main.getSystemService(context.CLIPBOARD_SERVICE)
        plus.android.invoke(clip, 'setText', content)
        break
    }
    showToast('复制成功')
  }

  showToast() {
    return showToast
  }

  // 获取剪贴板
  getClip() {
    var content
    switch (plus.os.name) {
      case 'iOS':
        var UIPasteboard = plus.ios.importClass('UIPasteboard')
        var generalPasteboard = UIPasteboard.generalPasteboard()
        content = generalPasteboard.valueForPasteboardType('public.utf8-plain-text')
        break
      case 'Android':
        var context = plus.android.importClass('android.content.Context')
        var main = plus.android.runtimeMainActivity()
        var clip = main.getSystemService(context.CLIPBOARD_SERVICE)
        content = plus.android.invoke(clip, 'getText')
        break
    }
    return content
  }

  // 事件
  event(eventName, data) {
    const views = plus.webview.all()
    views.forEach((item) => {
      item.evalJS(`typeof SAPP != 'undefined' && SAPP.receive('${eventName}', ${data})`)
    })
  }

  on(eventName, callback) {
    console.log(`${eventName} bind success`)
    try {
      this._events[eventName] = callback
      console.log(this._events[eventName])
    } catch (e) {
      log.error('sapp on error')
    }
  }

  receive(eventName, data) {
    try {
      this._events[eventName](data)
      log.info(`sapp event: ${eventName} receive success`)
    } catch (e) {
      log.error('sapp receive error')
    }
  }

  //
  call(eventName, data) {
    const launchWebview = plus.webview.getLaunchWebview()
    launchWebview.evalJS(`plus.call('${eventName}', ${data})`)
  }

  reload() {
    plus.webview.currentWebview().reload()
  }

  // 获取定位信息
  getGeoLocation() {
    return new Promise((reslove, reject) => {
      plus.geolocation.getCurrentPosition(
        (e) => {
          const param = {
            latitude: e.coords.latitude,
            longitude: e.coords.longitude
          }
          reslove(param)
        },
        (e) => {
          reject(e)
        },
        {
          provider: 'amap'
        }
      )
    })
  }

  // 获取当前webview接收到的参数
  getCurrentPagesParams() {
    return plus.webview.currentWebview()
  }

  // APP 退出
  exitApp() {
    plus.runtime.quit()
  }

  isSystem() {
    return plus.os.name
  }
}

export default new MAPP()
