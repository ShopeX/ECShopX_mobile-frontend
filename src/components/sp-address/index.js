import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView } from '@tarojs/components'
import api from '@/api'
import { classNames } from '@/utils'
import { SpFloatLayout } from '@/components'
import './index.scss'

const initialState = {
  addressList: [],
  areaData: [],
  areaList: [],
  multiIndex: [0, 0, 0],
  selectValue: [],
  selectId: [],
  isOpened: true,
  pindex: 0
}

function SpAddress() {
  const [state, setState] = useImmer(initialState)
  const { addressList, areaList, multiIndex, selectValue, selectId, isOpened, pindex } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const _addressList = await api.member.areaList()
    let _areaList,
      maxLevel = 0
    const recursionAddress = (list, level = 0) => {
      if (!list) {
        return null
      }
      level++

      const result = list.map((item) => {
        return {
          label: item.label,
          parent_id: item.parent_id,
          id: item.id,
          level,
          children: recursionAddress(item.children, level)
        }
      })
      if (maxLevel < level) maxLevel = level

      //
      return result
    }

    const resAddressList = recursionAddress(_addressList)
    _areaList = new Array(maxLevel).fill([])
    _areaList[0] = resAddressList.map(({ parent_id, label, id, level }) => {
      return {
        parent_id,
        id,
        label,
        level
      }
    })
    console.log('resAddressList:', resAddressList, _areaList)
    setState((draft) => {
      draft.addressList = resAddressList
      draft.areaList = _areaList
    })
  }

  const handleClickItem = ({ label, id, level }) => {
    const _areaList = (() => {
      if (level == 1) {
        return addressList.find((item) => item.id == id).children
      } else if (level == 2) {
        return areaList[1].find((item) => item.id == id).children
      }
    })()
    setState((draft) => {
      if (_areaList) {
        draft.areaList[level] = _areaList
      }
      draft.pindex = level

      if (selectValue.length < level) {
        draft.selectValue[level - 1] = {
          label,
          id,
          level
        }
      } else {
        draft.selectValue[level - 1] = {
          label,
          id,
          level
        }
        if (level < selectValue.length) {
          draft.selectValue.splice(level, selectValue.length - level)
        }
      }
    })
  }

  const handleClickSelectItem = ({ parent_id, label, id, level }) => {
    setState((draft) => {
      draft.areaList[level] = areaList[level - 1]
      draft.pindex = level
      if (level < selectValue.length) {
        draft.selectValue.splice(level, selectValue.length - level)
      }
    })
  }

  return (
    <View className='sp-address'>
      <View className='address-content'></View>
      <SpFloatLayout title='选择地址' open={isOpened} onClose={() => {}}>
        <View className='address-hd'>
          {selectValue.map((item, index) => (
            <View
              className='tab-item'
              key={`tab-item__${index}`}
              onClick={handleClickSelectItem.bind(this, item)}
            >
              {item.label}
            </View>
          ))}
          {selectValue.length < areaList.length && <View className='tab-item'>请选择</View>}
        </View>
        <ScrollView className='address-bd' scrollY>
          {areaList?.map((item, index) => (
            <View className='address-col' key={`address-col__${index}`}>
              {item.map((sitem, sindex) => (
                <View
                  className={classNames('address-item', {
                    active: selectValue?.[pindex - 1]?.id == sitem.id
                  })}
                  key={`address-item__${sindex}`}
                  onClick={handleClickItem.bind(this, sitem)}
                >
                  {sitem.label}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </SpFloatLayout>
    </View>
  )
}

SpAddress.options = {
  addGlobalClass: true
}

export default SpAddress
