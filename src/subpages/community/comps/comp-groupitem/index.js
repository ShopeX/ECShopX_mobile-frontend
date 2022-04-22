import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './index.scss'

function CompGroupItem(props) {
  return (
    <View className='comp-group-item'>
      <View className='group-item-hd'>
        <View>
          <View>[快团团保供]</View>
          <View>
            <SpPrice value={100} />
          </View>
        </View>
        <View></View>
      </View>
      <View className='group-item-bd'>
        <ScrollView scrollX className='img_list'>
          {[1, 2, 3].map((item, idx) => {
            return (
              <View className='goods-item' key={`goods-item__${idx}`}>
                <SpImage />
              </View>
            )
          })}
        </ScrollView>
      </View>
      <View className='group-item-ft'></View>
    </View>
  )
}

CompGroupItem.options = {
  addGlobalClass: true
}

export default CompGroupItem
