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
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'

const initialState = {
  newList: []
}

/**
 * 支持：自定义头部信息，头部宽度，接口返回列表数据
 * tabList：[] 接口返回列表数据
 * listHeader: [{ title: '头部信息', id: '当前头部信息对应的字断',width: '当前头部信息对应的字段宽度||默认80px' }]
 */

function Table(props) {
  const [state, setState] = useImmer(initialState)
  const { listHeader, listData } = props
  const { newList } = state

  useEffect(() => {
    handleList()
  }, [listData])

  const handleList = () => {
    let res = []
    listHeader.map((item) => {
      res.push({
        title: item.title,
        width: item?.width ? item.width : '80px',
        list: convertValuesToStrings(listData).map((data) => (data[item.id] ? data[item.id] : ''))
      })
    })

    setState((draft) => {
      draft.newList = res
    })
  }

  const convertValuesToStrings = (objects) =>
    objects.map((obj) =>
      Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, String(value)]))
    )

  return (
    <View className='table'>
      {/* 列表 */}
      <ScrollView scrollX>
        <View className='list-all'>
          {newList.map((item, index) => {
            return (
              <View className='list-all-item' key={index}>
                <Text style={{ width: item.width }}>{item.title}</Text>
                {item?.list?.map((items, indexs) => {
                  return (
                    <Text style={{ width: item.width }} key={indexs}>
                      {items}
                    </Text>
                  )
                })}
              </View>
            )
          })}
        </View>
      </ScrollView>

      <View className='nodata'>{listData.length <= 0 ? '-- 暂无数据 --' : '-- 到底啦 --'}</View>
    </View>
  )
}

Table.options = {
  addGlobalClass: true
}

export default Table
