import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import { SpPage } from '@/components'
import "./result.scss";


function DianwuTradeResult(props) {
  return <SpPage className='page-dianwu-trade-result'></SpPage>;
}

DianwuTradeResult.options = {
  addGlobalClass: true
}

export default DianwuTradeResult
