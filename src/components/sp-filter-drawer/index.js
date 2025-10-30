// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro from '@tarojs/taro'
import React, { useCallback, useState, useMemo } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'
// import { SpNewDrawer } from "@/components";
// import CustomButton from "./comps/button";
import './index.scss'

const JSONSTR = (obj) => JSON.parse(JSON.stringify(obj))

const SpFilterDrawer = (props) => {
  const { visible = false, filterData = [], onCloseDrawer = () => {} } = props

  const filterObject = useMemo(() => {
    const keysObject = filterData
      .map((item) => item.value)
      .reduce((total, current) => {
        total[current] = []
        return total
      }, {})
    return keysObject
  }, [filterData.length])

  const [selectedValue, setSelectedValue] = useState(JSONSTR(filterObject))

  const handleClickLabel = (item, key) => {
    let selected = selectedValue[key]
    let selectedIndex = selected.indexOf(item.value)
    if (selectedIndex > -1) {
      selected.splice(selectedIndex, 1)
    } else {
      selected.push(item.value)
    }
    setSelectedValue(
      JSONSTR({
        ...selectedValue,
        [key]: [...selected]
      })
    )
  }

  const handleConfirm = useCallback(() => {
    onCloseDrawer(selectedValue)
  }, [onCloseDrawer, selectedValue])

  const handleReset = useCallback(() => {
    setSelectedValue(JSONSTR(filterObject))
    onCloseDrawer(filterObject)
  }, [onCloseDrawer, filterObject])

  return null
  // return (
  //   <SpNewDrawer visible={visible} onClose={onCloseDrawer}>
  //     <View className={classNames("sp-new-filter-drawer")}>
  //       <ScrollView className={"sp-new-filter-drawer-container"}>
  //         {filterData.map((item) => {
  //           return (
  //             <View className={"sp-new-filter-drawer-container-block"}>
  //               <View className={"title"}>{item.label}</View>
  //               {item.children.map((citem, index) => (
  //                 <View
  //                   className={classNames("sp-filter-block", {
  //                     checked: selectedValue[item.value].includes(citem.value),
  //                   })}
  //                   onClick={() => handleClickLabel(citem, item.value)}
  //                 >
  //                   {citem.label}
  //                 </View>
  //               ))}
  //             </View>
  //           );
  //         })}
  //       </ScrollView>
  //       <View className={"sp-new-filter-drawer-action"}>
  //         <CustomButton onConfirm={handleConfirm} onReset={handleReset} />
  //       </View>
  //     </View>
  //   </SpNewDrawer>
  // );
}

SpFilterDrawer.options = {
  addGlobalClass: true
}

export default SpFilterDrawer
