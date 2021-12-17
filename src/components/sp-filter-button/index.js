import Taro from "@tarojs/taro";
import React, { useCallback, useState, useMemo } from "react"; 
import "./index.scss";
 

const SpFilterButton = (props) => {

    const {
        resetText='重置',
        confirmText='确定并筛选'
    }=props;
  
    return (
      <View className={"sp-filter-button"}>
          <View className={"sp-filter-button_reset"}>{resetText}</View>
          <View className={"sp-filter-button_confirm"}>{confirmText}</View>
      </View>
    )
};

SpFilterButton.options = {
  addGlobalClass: true,
};

export default React.memo(SpFilterButton);
