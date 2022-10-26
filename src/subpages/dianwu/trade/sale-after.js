import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import "./sale-after.scss";


function DianwuSaleAfter(props) {
  return <View className="page-dianwu-sale-after"></View>;
}

DianwuSaleAfter.options = {
  addGlobalClass: true
}

export default DianwuSaleAfter
