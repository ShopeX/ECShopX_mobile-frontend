import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
// import React from 'react'
import './index.scss'
import { classNames, JumpStoreIndex, JumpGoodDetail } from "@/utils";

function SpShopFullReduction(props){
    const { info } = props
    const {label, text} = info
    return (
        <View className={classNames(
            "sp-shop-fullReduction",
          )}>
            <View className='label-style'>{label}</View>
            <Text className='text-style'>{text}</Text>
        </View>
    )
}

export default SpShopFullReduction