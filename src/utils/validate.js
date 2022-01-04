const phone_rule = /^1[3456789]\d{9}$/
const pass_rule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/
const num_rule = /^[0-9]*$/
const letter_rule = /^[A-Za-z]+$/

const email_rule = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/

const validate = {
  isRequired: function (val) {
    return !(!val || val.length === 0)
  },
  isMobileNum: function (val) {
    return phone_rule.test(val)
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
  checkTax (val) {
    return /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(val)
  }
}

export default validate
