import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import React, { useState, useCallback, useEffect } from "react"
import { classNames } from "@/utils";
import { SpImage, SpNewPrice } from "@/components";
import api from "@/api";
import "./index.scss";

function SpShopCoupon( props ) {
  const { className, info } = props
  const { card_type, discount, least_cost } = info;
  let couponText = ''
  // 折扣券
  if ( card_type == 'discount' ) {
    couponText = `${(100 - info.discount) / 10}折`;
  } else if ( card_type == 'cash' ) { // 满减券
    couponText = `${info.reduce_cost / 100}元`;
  }

  return (
    <View
      className={classNames(
        "sp-shop-coupon",
        {
          active: false,
        },
        className
      )}
    >
      <View className='coupon-wrap'>
        <Text className="coupon-text">{couponText}</Text>
        <Text className="coupon-status">
          {info.receive == 1 ? "已领" : "领取"}
        </Text>
      </View>
    </View>
  );
}

SpShopCoupon.options = {
  addGlobalClass: true
};

export default SpShopCoupon;
