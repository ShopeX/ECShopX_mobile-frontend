import Taro, { useRouter } from '@tarojs/taro'

export function setPageTitle(title) {
  document.title = title
  var mobile = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(mobile)) {
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    // 替换成站标favicon路径或者任意存在的较小的图片即可
    // iframe.setAttribute('src', '/favicon.ico')
    // iframe.setAttribute('src','/wt_logo.png')
    var iframeCallback = function() {
      setTimeout(function() {
        iframe.removeEventListener('load', iframeCallback)
        document.body.removeChild(iframe)
      }, 0)
    }
    iframe.addEventListener('load', iframeCallback)
    document.body.appendChild(iframe)
  }
}

export const platformTemplateName = 'yykweishop'

export const transformPlatformUrl = (url) => {
  return url
}

// 授权页面
export const goToAuthPage = () => {
  const router = useRouter()
  const { path } = router
  Taro.navigateTo({
    url: `/pages/auth/login?redirect=`
  })
}

class CreateIntersectionObserver {
  constructor(options) {
    this.options = options
    this['on-observer'] = () => {}
    this.init()
  }

  init() {
    const { el } = this.options
    if (!el) {
      throw new Error('createIntersectionObserver options el is null')
    }
    this.observer = new IntersectionObserver(
      (res) => {
        const { isIntersecting } = res[0]
        if (isIntersecting) {
          this['on-observer']()
        }
      },
      {
        // root: document.querySelector(".home-wgts"),
        // threshold: [0, 0.8]
      }
    )
    this.observer.observe(document.querySelector(el))
    return this
  }

  on(event, fn) {
    this[event] = fn
  }
}

export { CreateIntersectionObserver }

export const createIntersectionObserver = (el) => {
  return new Promise((reslove, reject) => {
    const observer = new IntersectionObserver(
      (res) => {
        const { isIntersecting } = res[0]
        if (isIntersecting) {
        }
      },
      {
        // root: document.querySelector(".home-wgts"),
        // threshold: [0, 0.8]
      }
    )
    observer.observe(document.querySelector(el))
    this.observe = observer
  })
}


export const payment_platform='h5';