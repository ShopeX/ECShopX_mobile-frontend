import React from "react";
import { View } from "@tarojs/components";
import { AtDrawer } from "taro-ui";
import './index.scss'

function SpDrawer(props) {
  const { show, onClose = () => {}, children } = props;
  return (
    <AtDrawer
      className="sp-drawer"
      show={show}
      right
      mask
      onClose={onClose}
      width="260px"
    >
      <View className="sp-drawer__body">{children}</View>
      <View className="sp-drawer__footer"></View>
    </AtDrawer>
  );
}

export default SpDrawer;
