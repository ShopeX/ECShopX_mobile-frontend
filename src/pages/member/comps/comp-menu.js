import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { SpImage } from "@/components";
import { classNames, styleNames } from "@/utils";

import "./comp-menu.scss";

const MENUS = [
  { key: "group", name: "我的拼团", icon: "m_menu_pintuan.png" },
  { key: "pointMenu", name: "积分商城", icon: "m_menu_poin.png" },
  { key: "boost_activity", name: "助力活动", icon: "m_menu_zhulihuodong.png" },
  { key: "boost_order", name: "助力订单", icon: "m_menu_zhulidingdan.png" },

  { key: "offline_order", name: "线下订单", icon: "m_menu_xianxiadingdan.png" },
  // community_order: { name: "社区团购", icon: "m_menu_tuangou.png" },
  { key: "activity", name: "活动预约", icon: "m_menu_baoming.png" },
  { key: "prorate", name: "推广管理", icon: "m_menu_tuiguang.png" },

  { key: "complaint", name: "投诉记录", icon: "m_menu_toushu.png" }
];

function CompMenu(props) {
  return (
    <View className="comp-menu">
      {MENUS.map((item, index) => (
        <View className="menu-item" key={`menu-item__${index}`}>
          <SpImage src={item.icon} width={120} />
          <Text className='menu-name'>{item.name}</Text>
        </View>
      ))}
    </View>
  );
}

export default CompMenu;
