import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  SpFloatMenus,
  SpFloatMenuItem,
  SpFloatAd,
  SpImage,
} from "@/components";
import api from '@/api'
import S from '@/spx'
import { SG_SHARER_UID } from '@/consts'
import "./comp-floatmenu.scss";

function CompFloatMenu( props ) {
  // useEffect( () => {
  //   const distributionShopId = Taro.getStorageSync(SG_SHARER_UID);
  //   if (!S.getAuthToken() && !distributionShopId) {
  //     return;
  //   }
  //   const param = {
  //     user_id: distributionShopId || userId,
  //   };
  //   const res = await api.distribution.info(param);
  //   const { user_id, is_valid, selfInfo = {}, parentInfo = {} } = res;
  //   if (is_valid) {
  //     featuredshop = user_id;
  //   } else if (selfInfo.is_valid) {
  //     featuredshop = selfInfo.user_id;
  //   } else if (parentInfo.is_valid) {
  //     featuredshop = parentInfo.user_id;
  //   }
  //   this.setState({
  //     featuredshop,
  //   });
  // }, [])

  return (
    <View className="comp-floatmenu">
      <SpFloatMenuItem>
        <SpFloatAd />
      </SpFloatMenuItem>
      
      <SpImage src="gift_mini.png" width={145} />
    </View>
  );
}

CompFloatMenu.options = {
  addGlobalClass: true,
};

export default CompFloatMenu;
