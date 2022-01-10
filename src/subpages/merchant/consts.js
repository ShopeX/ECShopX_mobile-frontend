//商户类型
export const MERCHANT_TYPE = 'merchantType'

//经营范围
export const BUSINESS_SCOPE = 'businessScope'

export const BANG_NAME = 'bankName'

//银行账户类型 对私
export const BANK_PRIVATE = 2
//银行账户类型 对公
export const BANK_PUBLIC = 1

export const PLACEHOLDER_SELECTOR = {
  [MERCHANT_TYPE]: '请输入商家类型',
  [BUSINESS_SCOPE]: '请输入经营范围',
  [BANG_NAME]: '请输入结算银行名称'
}

export const STEPTWOTEXT = (field) => `结算银行卡持卡人姓名要与${field}姓名一致`

export const STEPTHREETEXT = '上传图片尺寸需小于2M'

export const MerchantStepKey = 'merchant-step'

export const AUDITING = 1
export const AUDIT_SUCCESS = 2
export const AUDIT_FAIL = 3
export const AUDIT_UNKNOWN = 0

export const AUDIT_MAP_IMG = {
  1: 'default_wait.png',
  2: 'default_pass.png',
  3: 'default_fail.png'
}

export const AUDIT_MAP_TITLE = {
  1: '已提交申请，请耐心等待～',
  2: '恭喜您已完成入驻！',
  3: '很抱歉！您的入驻申请未通过'
}

export const AUDIT_MAP_RENDER = {
  1: 'renderIng',
  2: 'renderSuccess',
  3: '很抱歉！您的入驻申请未通过'
}
