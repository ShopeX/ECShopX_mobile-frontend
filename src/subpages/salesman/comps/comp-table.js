import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import './comp-table.scss'

const initialState = {
  newList: []
}

/**
 * 支持：自定义头部信息，头部宽度，接口返回列表数据
 * tabList：[] 接口返回列表数据
 * listHeader: [{ title: '头部信息', id: '当前头部信息对应的字断',width: '当前头部信息对应的字段宽度||默认80px' }]
 */

function CompTable(props) {
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
        list: listData.map((data) => (data[item.id] ? data[item.id] : ''))
      })
    })

    setState((draft) => {
      draft.newList = res
    })
  }

  return (
    <View className='comp-table'>
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

CompTable.options = {
  addGlobalClass: true
}

export default CompTable
