import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { useMemo, memo, useState, useCallback, useEffect } from "react";
import { classNames, JumpStoreIndex, JumpGoodDetail } from "@/utils";
import { SpImage, SpShopCoupon } from "@/components";
import api from "@/api";
import "./index.scss";


function SpShopItem(props) {
  const { className, info } = props;
  if (!info) {
    return null;
  }

  const { logo, name, distance, cardList, salesCount } = info;

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
        <View className="item-bd-ac"></View>
      </View>
    </View>
  );
}

SpShopItem.options = {
  addGlobalClass: true,
};

export default memo(SpShopItem);
