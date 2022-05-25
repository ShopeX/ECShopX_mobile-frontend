import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import api from '@/api'
import './index.scss'

const initialState = {
  areaData: [],
  areaList: [[], [], []],
  multiIndex: [0, 0, 0],
  selectValue: [],
  selectId: []
}

function SpPickerAddress(props) {
  const { onChange = () => {}, value = [] } = props
  const [state, setState] = useImmer(initialState)
  const { areaData, areaList, multiIndex, selectValue, selectId } = state
  
  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const res = await api.member.areaList()
    const arrayProvince = []
    const arrayCity = []
    const arrayCounty = []
    const multiIndex = [0, 0, 0]
    // debugger
    if (value.length > 0) {
      res.forEach((item, index) => {
        arrayProvince.push(item.label)
        if (item.label == value[0]) {
          multiIndex[0] = index
          item.children.forEach((citem, cindex) => {
            arrayCity.push(citem.label)
            if (citem.label == value[1]) {
              multiIndex[1] = cindex
              citem.children.forEach((sitem, sindex) => {
                arrayCounty.push(sitem.label)
                if (sitem.label == value[2]) {
                  multiIndex[2] = sindex
                }
              })
            }
          })
        }
      })
    } else {
      res.forEach((item, index) => {
        arrayProvince.push(item.label)
        if (index === 0) {
          item.children.forEach((citem, cindex) => {
            arrayCity.push(citem.label)
            if (cindex === 0) {
              citem.children.forEach((sitem) => {
                arrayCounty.push(sitem.label)
              })
            }
          })
        }
      })
    }

    setState((draft) => {
      draft.areaData = res
      draft.areaList = [arrayProvince, arrayCity, arrayCounty]
      draft.multiIndex = multiIndex
      draft.selectValue = value
    })
  }

  const onMultiPickerChange = (e) => {
    const [provinceIndex = 0, cityIndex = 0, countryIndex = 0] = e.detail.value
    const selectValue = []
    const selectId = []
    areaData.forEach((item, index) => {
      if (index === provinceIndex) {
        selectValue.push(item.label)
        selectId.push(item.value)
        item.children.forEach((citem, cindex) => {
          if (cindex === cityIndex) {
            selectValue.push(citem.label)
            selectId.push(citem.value)
            citem.children.forEach((sitem, sindex) => {
              if (sindex === countryIndex) {
                selectValue.push(sitem.label)
                selectId.push(sitem.value)
              }
            })
          }
        })
      }
    })
    console.log(`selectValue:`, selectValue, selectId)
    setState((draft) => {
      draft.selectValue = selectValue
      draft.selectId = selectId
    })
    onChange(selectValue, selectId)
  }

  const onMultiPickerColumnChange = (e) => {
    const { column, value } = e.detail
    const arrayCity = []
    const arrayCountry = []

    let curCity
    let curCountry
    if (column === 0) {
      curCity = areaData[value].children
      curCity.forEach((citem, cindex) => {
        arrayCity.push(citem.label)
        if (cindex == 0) {
          curCountry = citem.children
          curCountry.forEach((sitem) => {
            arrayCountry.push(sitem.label)
          })
        }
      })
      setState((draft) => {
        draft.multiIndex = [value, 0, 0]
        draft.areaList = [areaList[0], arrayCity, arrayCountry]
      })
    } else if (column === 1) {
      curCity = areaData[multiIndex[0]].children
      curCity.forEach((citem, cindex) => {
        if (cindex == value) {
          curCountry = citem.children
          curCountry.forEach((sitem) => {
            arrayCountry.push(sitem.label)
          })
        }
      })
      setState((draft) => {
        draft.multiIndex = [multiIndex[0], value, 0]
        draft.areaList = [areaList[0], areaList[1], arrayCountry]
      })
    } else {
      setState((draft) => {
        draft.multiIndex = [multiIndex[0], multiIndex[1], value]
      })
    }
  }

  return (
    <View className='sp-picker-address'>
      <Picker
        mode='multiSelector'
        onChange={onMultiPickerChange}
        onColumnChange={onMultiPickerColumnChange}
        value={multiIndex}
        range={areaList}
      >
        <View className='picker-con'>
          {selectValue.length > 0 && <Text className='picker-value'>{selectValue.join(' ')}</Text>}
          {selectValue.length == 0 && <Text className='placeholder'>选择省市区</Text>}
        </View>
      </Picker>
    </View>
  )
}

SpPickerAddress.options = {
  addGlobalClass: true
}

export default SpPickerAddress
