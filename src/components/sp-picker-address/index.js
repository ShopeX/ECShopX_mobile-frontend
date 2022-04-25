import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import api from '@/api'
import './index.scss'

const initialState = {
  areaData: [],
  areaList: [[], [], []],
  multiIndex: [0, 0, 0]
}

function SpPickerAddress(props) {
  const [state, setState] = useImmer(initialState)
  const { areaData, areaList, multiIndex } = state
  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const res = await api.member.areaList()
    const provices = []
    const citys = []
    const countys = []
    res.forEach((item, index) => {
      provices.push(item.label)
      if (index === 0) {
        item.children.forEach((citem, cindex) => {
          citys.push(citem.label)
          if (cindex === 0) {
            citem.children.forEach((sitem) => {
              countys.push(sitem.label)
            })
          }
        })
      }
    })
    setState((draft) => {
      draft.areaData = res
      draft.areaList = [provices, citys, countys]
    })
  }

  const init = () => {}

  const onMultiPickerChange = (e) => {
    const { info } = this.state
    const [ proviceIndex = 0, cityIndex = 0, countryIndex = 0 ] = e.detail.value
    areaData.forEach((item, index) => {
      if (index === proviceIndex) {
        info.province = item.label
        item.children.forEach((citem, cindex) => {
          if (cindex === cityIndex) {
            citem.children.forEach((sitem, sindex) => {
              if (sitem === countryIndex) {
                info.county = th_item.label
              }
            })
          }
        })
      }
    })
    this.setState({ info })
  }

  const onMultiPickerColumnChange = (e) => {
    const { column, value } = e.detail
    const { areaList, multiIndex } = this.state
    if (e.detail.column === 0) {
      this.setState({
        multiIndex: [e.detail.value, 0, 0]
      })
      this.nList.map((item, index) => {
        if (index === e.detail.value) {
          let arrCity = []
          let arrCounty = []
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if (c_index === 0) {
              c_item.children.map((cny_item) => {
                arrCounty.push(cny_item.label)
              })
            }
          })
          areaList[1] = arrCity
          areaList[2] = arrCounty
          this.setState({ areaList })
        }
      })
    } else if (e.detail.column === 1) {
      multiIndex[1] = e.detail.value
      multiIndex[2] = 0
      this.setState(
        {
          multiIndex
        },
        () => {
          this.nList[multiIndex[0]].children.map((c_item, c_index) => {
            if (c_index === e.detail.value) {
              let arrCounty = []
              c_item.children.map((cny_item) => {
                arrCounty.push(cny_item.label)
              })
              areaList[2] = arrCounty
              this.setState({ areaList })
            }
          })
        }
      )
    } else {
      multiIndex[2] = e.detail.value
      this.setState({
        multiIndex
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
        <View className='picker'>
          <View className='picker__title'>选择省市区</View>
          {/* {info.address_id ? (
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
          )} */}
        </View>
      </Picker>
    </View>
  )
}

SpPickerAddress.options = {
  addGlobalClass: true
}

export default SpPickerAddress
