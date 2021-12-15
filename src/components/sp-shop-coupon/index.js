import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import React, { useState, useCallback, useEffect } from "react"
import { classNames } from "@/utils";
import { SpImage, SpNewPrice } from "@/components";
import api from "@/api";
import "./index.scss";

function SpShopCoupon(props) {
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
      <Text className="coupon-price">{text}</Text>
      <Text className="coupon-status"></Text>
    </View>
  );
}

SpShopCoupon.options = {
  addGlobalClass: true
};

export default React.memo(SpShopCoupon);
