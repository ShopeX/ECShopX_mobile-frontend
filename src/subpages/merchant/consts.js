export const MERCHANT_TYPE = 'merchantType'

export const BUSINESS_SCOPE = 'businessScope'

export const STEPTWOTEXT = '结算银行卡持卡人姓名要与法人姓名一致'

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
