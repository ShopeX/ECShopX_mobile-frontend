import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import "./espier-checkout.scss";


function PointShopEspierCheckout( props ) {
   return <View className="page-pointshop-espiercheckout"></View>;
}

PointShopEspierCheckout.options = {
   addGlobalClass: true
}

export default PointShopEspierCheckout