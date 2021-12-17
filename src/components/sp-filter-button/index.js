import Taro from "@tarojs/taro";
import React, { useCallback, useState, useMemo } from "react"; 
import { View, Text, Image } from '@tarojs/components'
import "./index.scss";
 
const voidFunc=()=>{};

const SpFilterButton = (props) => {

    const {
        resetText='重置',
        confirmText='确定并筛选',
        onConfirm=voidFunc,
        onReset=voidFunc
    }=props;
  
    return (
      <View className={"sp-filter-button"}>
          <View className={"sp-filter-button_reset"} onClick={onReset}>{resetText}</View>
          <View className={"sp-filter-button_confirm"} onClick={onConfirm}>{confirmText}</View>
      </View>
    )
};

SpFilterButton.options = {
  addGlobalClass: true,
};

export default React.memo(SpFilterButton);
