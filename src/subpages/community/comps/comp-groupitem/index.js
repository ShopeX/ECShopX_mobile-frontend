import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './index.scss'

function CompGroupItem(props) {
  return (
    <View className='comp-group-item'>
      <View className='group-item-hd'>
        <View className="item-info">
          <View className="name">[快团团保供]</View>
          <SpPrice size={36} value={100} />
        </View>
        <View></View>
      </View>
      <View className='group-item-bd'>
        <ScrollView scrollX className='img_list'>
          {[1, 2, 3, 4, 5, 6].map((item, idx) => (
            <View className='goods-item' key={`goods-item__${idx}`}>
              <SpImage width={200} height={200} />
            </View>
          ))}
        </ScrollView>
        <View className="item-status">
          <Text className="status">正在跟团中</Text>
          {/* <View>分享</View> */}
        </View>
      </View>
      <View className='group-item-ft'>
        <View>实际收入<SpPrice value={100} /></View>
        <View><Text>已跟团 5人次</Text> <Text>已跟团数量 25箱</Text> <Text>查看 5人</Text></View>
      </View>
    </View>
  )
}

CompGroupItem.options = {
  addGlobalClass: true
}

export default CompGroupItem
