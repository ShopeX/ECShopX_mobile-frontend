/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { $t } from '@/i18n'

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
  /** 邮箱通道注册/重置密码：≥8 位、须同时含字母与数字（与 MemberPasswordPolicy 对齐，弱口令由服务端校验） */
  isEmailChannelPassword: function (val) {
    return pass_rule.test(val)
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
      message = $t('6f8a23e8.076573')
    }
    return message
  },
  validateEmail: function (val) {
    let message = null
    if (!email_rule.test(val)) {
      message = $t('6f8a23e8.75262e')
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
