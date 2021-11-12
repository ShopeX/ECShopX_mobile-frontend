import Nerv from 'nervjs'

export function isElement(o) {
  return o instanceof Element
}

export const hasClass = function(el, cls) {
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return !!(el.className || '').match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  }
}

export const addClass = function(el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else if (!hasClass(el, cls)) {
    el.className += ' ' + cls
  }
}

export const removeClass = function(el, cls) {
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
      el = Nerv.findDOMNode(el)
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
