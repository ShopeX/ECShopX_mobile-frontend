const log = {
  info(msg) {
    console.log('%c [mui-taro] ' + msg, 'color:#00f;')
  },
  error(msg) {
    console.log('%c [mui-taro] ' + msg, 'color:#f00;')
  }
}

export function hasClass(elements, cName) {
  return !!elements.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'))
}

export function addClass(elements, cName) {
  if (!hasClass(elements, cName)) {
    elements.className += ' ' + cName
  }
}

export function removeClass(elements, cName) {
  if (hasClass(elements, cName)) {
    elements.className = elements.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' ')
  }
}

export function showToast(title) {
  plus.nativeUI.toast(title, {
    verticalAlign: 'center'
  })
}

export default log
