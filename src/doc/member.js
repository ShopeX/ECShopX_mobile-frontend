/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

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
