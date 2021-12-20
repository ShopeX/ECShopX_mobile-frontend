import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { useMemo, useState, useCallback, useEffect } from "react";
import { classNames, JumpStoreIndex, JumpGoodDetail } from "@/utils";
import { SpImage, SpShopCoupon,SpShopFullReduction } from "@/components";
import api from "@/api";
import "./index.scss";

function SpShopItem(props) {
  const { className, info } = props;
  if (!info) {
    return null;
  }
  const { logo, name, distance, cardList, salesCount,fullReduction = [{label:"满减",text:"好物狂欢节享满199减30"},{label:"满减",text:"好物狂欢节享满199减30"}]  } = info;
  console.log('info',info)
  return (
    <View className={classNames("sp-shop-item", className)}>
      <View className="shop-item-hd">
        <SpImage className="shop-logo" src={logo} />
      </View>
      <View className="shop-item-bd">
        <View className="item-bd-hd">
          <View className="shop-name">{name}</View>
          <View className="shop-distance">{distance}</View>
        </View>
        <View className="item-bd-sb">
          <View className="score">
            评分：{5} 月销：{salesCount}
          </View>
          <View className="express">达达配送</View>
        </View>
        <View className="item-bd-bd">
          {cardList.map((item, index) => (
            <SpShopCoupon info={item} key={`shop-coupon__${index}`} />
          ))}
        </View>
        <View className='item-bd-fr'>
          {fullReduction.map((item, index) => (
            <SpShopFullReduction info={item} key={`shop-full-reduction__${index}`} />
          ))}
        </View>
      </View>
    </View>
  );
}

SpShopItem.options = {
  addGlobalClass: true,
};

export default SpShopItem;
