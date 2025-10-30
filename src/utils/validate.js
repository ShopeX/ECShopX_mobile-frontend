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
const phone_rule = /^1[3456789]\d{9}$/
const password_rule = /^[(a-z|A-Z|0-9)]{6,16}$/
const pass_rule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/
const num_rule = /^[0-9]*$/
const letter_rule = /^[A-Za-z]+$/

const email_rule = /^[a-zA-Z0-9_.+-]+(\.[a-zA-Z0-9_.+-]+)*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

const validate = {
  isRequired: function (val) {
    return !(!val || val.length === 0)
  },
  isPassword: function (val) {
    return password_rule.test(val)
  },
  isMobileNum: function (val) {
    return phone_rule.test(val)
  },
  isEmail: (val) => {
    return email_rule.test(val)
  },
  validatePass2: function (val, val1) {
    let message = null
    if (val != val1) {
      message = '输入的密码不一致'
    }
    return message
  },
  validateEmail: function (val) {
    let message = null
    if (!email_rule.test(val)) {
      message = '邮箱格式不正确'
    }
    return message
  },
  // 企业税号
  checkTax(val) {
    return /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(val)
  },
  // 金额验证
  isMoney(val) {
    const reg = new RegExp('((^[1-9]\\d*)|^0)(\\.\\d{0,2}){0,1}$')
    return reg.test(val)
  },
  isIpx(str) {
    return (
      str.search(
        /iPhone\s*X|iPhone\s*11|iPhone\s*12|iPhone\s*13|iPhone\s*14|iPhone\s*15|iPhone\s*10/g
      ) > -1
    )
  }
}

export default validate
