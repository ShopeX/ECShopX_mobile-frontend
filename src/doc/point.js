import { formatDateTime, thousandthFormat } from '@/utils'

const JOURNAL_TYPE = {
  '1': '注册赠送',
  '2': '邀请注册赠送',
  '3': '充值赠送',
  '4': '储值兑换',
  '5': '积分换购',
  '6': '消费购物（支出）',
  '7': '消费购物（获取）',
  '8': '会员等级返佣',
  '9': '取消订单返还',
  '10': '退款返还',
  '11': '大转盘',
  '12': '商家手动修改',
  '13': '开放接口',
  '14': '分销佣金（积分）',
  '15': '商家导入修改',
  '16': '活动报名（获取）',
  '20': '发布笔记',
  '21': '笔记点赞',
  '22': '评论笔记',
  '23': '收藏笔记',
  '24': '分享笔记',
  '9920': '拒绝笔记',
  '9921': '拒绝点赞笔记',
  '9922': '拒绝评论笔记'
}

export const POINT_LIST_ITEM = {
  journalType: ({ journal_type }) => JOURNAL_TYPE[journal_type],
  outinType: 'outin_type',
  point: ({ point }) => thousandthFormat(point),
  orderId: 'order_id',
  created: ({ created }) => formatDateTime(created)
}
