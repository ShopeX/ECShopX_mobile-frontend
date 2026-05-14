/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
//商户类型
export const MERCHANT_TYPE = 'merchantType'

//经营范围
export const BUSINESS_SCOPE = 'businessScope'

export const BANG_NAME = 'bankName'

//银行账户类型 对私
export const BANK_PRIVATE = 2
//银行账户类型 对公
export const BANK_PUBLIC = 1

/** i18n 键：选择器搜索框占位（配合 $t） */
export const PLACEHOLDER_SELECTOR_KEY = {
  [MERCHANT_TYPE]: '651ad363.bd01c0',
  [BUSINESS_SCOPE]: '651ad363.146fa4',
  [BANG_NAME]: '651ad363.44d42d'
}

/** i18n 键：第二步底部说明（配合 ti，参数为「负责人」或「法人」的译文） */
export const STEPTWO_TEXT_KEY = '651ad363.8a1a44'

/** i18n 键：第三步底部说明 */
export const STEPTHREE_TEXT_KEY = '651ad363.46523e'

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

/** i18n 键：审核页状态标题（配合 $t） */
export const AUDIT_STATUS_TITLE_KEY = {
  1: '53023079.06f0eb',
  2: '53023079.392fd7',
  3: '53023079.228e44'
}
