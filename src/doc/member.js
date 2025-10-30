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

export const VIP_GRADE_ITEM = {
  grade_name: 'grade_name',
  description: 'description',
  pic: 'background_pic_url',
  grade_id: 'grade_id',
  discount: ({ privileges }) => {
    return privileges.discount
  },
  discount_desc: ({ privileges }) => {
    return privileges.discount_desc
  },
  grade_background: 'grade_background'
}

export const MEMBER_CARD_ITEM = {
  grade_name: 'grade_name',
  description: 'description',
  pic: 'background_pic_url',
  grade_id: 'grade_id',
  discount: ({ privileges }) => {
    return privileges.discount
  },
  discount_desc: ({ privileges }) => {
    return privileges.discount_desc
  },
  grade_background: 'grade_background'
}
