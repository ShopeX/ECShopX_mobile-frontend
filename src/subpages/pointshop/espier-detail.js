import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import "./espier-detail.scss";


function PointShopEspierDetail( props ) {
   return <View className="page-pointshop-espierdetail"></View>;
}

PointShopEspierDetail.options = {
   addGlobalClass: true
}

export default PointShopEspierDetail