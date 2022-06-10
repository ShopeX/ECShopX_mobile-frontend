export const VIP_GRADE_ITEM = {
  grade_name: 'grade_name',
  description: 'description',
  pic: 'background_pic_url',
  discount: ({ privileges }) => {
    return privileges.discount
  },
  discount_desc: ({ privileges }) => {
    return privileges.discount_desc
  }
}

export const MEMBER_CARD_ITEM = {
  grade_name: 'grade_name',
  description: 'description',
  pic: 'background_pic_url',
  discount: ({ privileges }) => {
    return privileges.discount
  },
  discount_desc: ({ privileges }) => {
    return privileges.discount_desc
  }
}