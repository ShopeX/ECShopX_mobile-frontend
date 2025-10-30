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
export function isElement(o) {
  return o instanceof Element
}

export const hasClass = function (el, cls) {
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return !!(el.className || '').match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  }
}

export const addClass = function (el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else if (!hasClass(el, cls)) {
    el.className += ' ' + cls
  }
}

export const removeClass = function (el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)', 'g')
    el.className = el.className.replace(reg, '')
  }
}

export function lockScreen(isLock = true) {
  if (process.env.TARO_ENV === 'h5') {
    const body = document.querySelector('body')
    if (isLock) {
      addClass(body, 'lock-screen')
    } else {
      removeClass(body, 'lock-screen')
    }
  }
}

export function toggleTouchMove(el, state = false) {
  if (process.env.TARO_ENV === 'h5') {
    if (!el) return
    if (!isElement(el)) {
      //eslint-disable-next-line
      // el = Nerv.findDOMNode(el)
    }
    if (!state) {
      el.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault()
        },
        { passive: false }
      )
    } else {
      el.removeEventListener('touchmove')
    }
  }
}
