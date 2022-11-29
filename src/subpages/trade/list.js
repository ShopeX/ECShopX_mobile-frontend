import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import "./list.scss";


function TradeList(props) {
  return <View className="page-trade-list"></View>;
}

TradeList.options = {
  addGlobalClass: true
}

export default TradeList
