import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import api from '@/api'
import './index.scss'

const initialState = {
  areaData: [],
  areaArray: [[], [], []],
  areaIndexArray: [0, 0, 0],
}

function SpPickerAddress(props) {
  const [state, setState] = useImmer(initialState)
  const { areaData } = state
  useEffect(() => {
    fetch()
  }, [])


  const fetch = async () => {
    const areaData = await api.member.areaList()
    setState(draft => {
      draft.areaData = areaData
    })
  }

  return (
    <View className='sp-picker-address'>
      {/* <Picker
        mode='multiSelector'
        onChange={this.bindMultiPickerChange}
        onColumnChange={this.bindMultiPickerColumnChange}
        value={multiIndex}
        range={areaList}
      >
        <View className='picker'>
          <View className='picker__title'>所在区域</View>
          {info.address_id ? (
            `${info.province}${info.city}${info.county}`
          ) : (
            <View>
              {multiIndex.length > 0 ? (
                <Text>
                  {areaList[0][multiIndex[0]]}
                  {areaList[1][multiIndex[1]]}
                  {areaList[2][multiIndex[2]]}
                </Text>
              ) : null}
            </View>
          )}
        </View>
      </Picker> */}
    </View>
  )
}

SpPickerAddress.options = {
  addGlobalClass: true
}

export default SpPickerAddress
