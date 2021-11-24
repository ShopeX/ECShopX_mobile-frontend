import Taro from '@tarojs/taro'

export function setPageTitle(title) {
  Taro.setNavigationBarTitle({
    title
  })
}

export const platformTemplateName = 'yykweishop'

export const transformPlatformUrl = (url) => {
  return url
}

//支付方式平台
export const payment_platform = 'wxMiniProgram'

class CreateIntersectionObserver {
  constructor(options) {
    this.options = options
    this['on-observer'] = () => {}
    this.init()
  }

  init() {
    const { el, scope } = this.options
    if (!el) {
      throw new Error('createIntersectionObserver options el is null')
    }
    this.observer = Taro.createIntersectionObserver(scope, {
      observeAll: true
    });
    this.observer.relativeToViewport( { bottom: 0 } ).observe( el, ( res ) => {
      if (res.intersectionRatio > 0) {
        this['on-observer'](res)
      }
    })
    return this
  }

  on(event, fn) {
    this[event] = fn
  }
}

export { CreateIntersectionObserver }