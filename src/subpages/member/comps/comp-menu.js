import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, styleNames } from '@/utils'

import './comp-menu.scss'

const MENUS = [
  {
    key: "popularize",
    name: "推广管理",
    icon: "m_menu_tuiguang.png",
    link: "/marketing/pages/distribution/index",
  },
  {
    key: "group",
    name: "我的拼团",
    icon: "m_menu_pintuan.png",
    link: "/marketing/pages/member/group-list",
  },
  {
    key: "pointMenu",
    name: "积分商城",
    icon: "m_menu_poin.png",
    link: "/pointitem/pages/list",
  },
  {
    key: "boost_activity",
    name: "助力活动",
    icon: "m_menu_zhulihuodong.png",
    link: "/boost/pages/home/index",
  },
  {
    key: "boost_order",
    name: "助力订单",
    icon: "m_menu_zhulidingdan.png",
    link: "/boost/pages/order/index",
  },

  {
    key: "offline_order",
    name: "线下订单",
    icon: "m_menu_xianxiadingdan.png",
    link: "/others/pages/bindOrder/index",
  },
  // community_order: { name: "社区团购", icon: "m_menu_tuangou.png" },
  {
    key: "activity",
    name: "活动预约",
    icon: "m_menu_baoming.png",
    link: "/marketing/pages/member/item-activity",
  },
  { key: "prorate", name: "推广管理", icon: "m_menu_tuiguang.png" },
  // {
  //   key: "complaint",
  //   name: "投诉记录",
  //   icon: "m_menu_toushu.png",
  //   link: "/marketing/pages/member/complaint-record",
  // },
];

function CompMenu( props ) {
  const { accessMenu, onLink = () => {}, isPromoter } = props
  if ( !accessMenu ) {
    return null
  }

  const menus = MENUS.filter( ( item ) => accessMenu[item.key] )
  return (
    <View className='comp-menu'>
      {menus.map((item, index) => (
        <View className='menu-item' key={`menu-item__${index}`} onClick={onLink.bind(this, item)}>
          <SpImage src={item.icon} width={100} />
          <Text className='menu-name'>
            {item.key == 'popularize' ? (isPromoter ? item.name : '我要推广') : item.name}
          </Text>
        </View>
      ))}
    </View>
  )
}

export default CompMenu
