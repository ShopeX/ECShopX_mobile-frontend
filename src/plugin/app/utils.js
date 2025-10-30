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
