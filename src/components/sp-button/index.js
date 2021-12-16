import Taro from "@tarojs/taro";
import { useState, useCallback } from "react";
import { View, Button } from "@tarojs/components";
import { AtButton } from "taro-ui";
import S from "@/spx";
import api from "@/api";
import { isWeixin, isAlipay, classNames, tokenParse } from "@/utils";
import "./index.scss";

function SpButton(props) {
  const {
    className,
    cancelText = "取消",
    confirmText = "确定",
    onCancel = () => {},
    onConfirm = () => {},
  } = props;

  return (
    <View className={classNames("sp-button", className)}>
      <View className="btn-cancel" onClick={onCancel}>
        {cancelText}
      </View>
      <View className="btn-confirm" onClick={onConfirm}>
        {confirmText}
      </View>
    </View>
  );
}

SpButton.options = {
  addGlobalClass: true,
};

export default SpButton;
