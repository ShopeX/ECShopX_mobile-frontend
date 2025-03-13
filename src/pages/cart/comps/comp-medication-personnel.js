import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { SpImage, SpScrollView } from '@/components'
import { AtFloatLayout, AtButton } from 'taro-ui'
import { View, Text, Button } from '@tarojs/components'
import api from '@/api'
import { relationship } from '@/consts'
import { showToast, validate } from '@/utils'

import './comp-medication-personnel.scss'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'

function CompMedicationPersonnel(props) {
  const {
    isOpened = false,
    colsePersonnel = () => { },
    listChangge = () => { },
  } = props

  const [state, setState] = useImmer({
    list: [],
    selector: relationship,
  })
  const goodsRef = useRef()

  const { list, selector } = state

  // useEffect(() => {
  //   return setState((draft) => {
  //     draft.list = []
  //   })
  // }, [])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize
    }
    const { total_count: total, list: list1 } = await api.prescriptionDrug.medicationPersonnelList(params)
    list1.forEach(element => {
      element.relationship = Number(element.relationship) - 1
      element.isShow = false
    });
    listChangge([...list, ...list1])
    setState((draft) => {
      draft.list = [...list, ...list1]
    })
    return {
      total
    }
  }

  const deletePersonnel = async (item) => {
    await api.prescriptionDrug.deleteMedicationPersonnel({ id: item.id })
    setState((draft) => {
      draft.list = []
    })
    showToast(`删除成功`)
    goodsRef.current.reset()
  }


  return (
    <View className='comp-medication-personnel'>
      <AtFloatLayout isOpened={isOpened} onClose={colsePersonnel}>
        <View>
          <View className='title'>
            <View className='title-text'>添加/修改用药人</View>
            <Text className='iconfont icon-guanbi-01' onClick={colsePersonnel}></Text>
          </View>
          <View className='prompt'>
            <Text className='iconfont icon-bg-security'></Text>
            您的信息仅用于平台信息校验，平台会保障您的个人信息安全
          </View>
          <SpScrollView className='informations' ref={goodsRef} fetch={fetch}>
            {
              list.length > 0 && list.map((item, index) => {
                return (
                  <View className='informations-item' key={index}>
                    <View className='label'>
                      {/* <SpImage src='men.png' width={80} /> */}
                      <SpImage src={item.user_family_gender == 1 ? item.user_family_age >= 18 ? 'men.png' : 'children_1.png' : item.user_family_age >= 18 ? 'women.png' : 'children_2.png'} width={80} />
                      <View className='info'>
                        <View>
                          <Text>{item.user_family_name}</Text>
                          <Text className='relationship'>{selector[item.relationship].value}</Text>
                        </View>
                        <View className='age'>{item.user_family_gender == 1 ? '男' : '女'} {item.user_family_age}岁</View>
                      </View>
                    </View>
                    <View className='icon-wrap'>
                      <Text className='iconfont icon-bianji1' onClick={() => {
                        Taro.navigateTo({
                          url: `/subpages/prescription/add-personnel?id=${item.id}`
                        })
                        colsePersonnel()
                      }}></Text>
                      <Text className='iconfont icon-shanchu' onClick={() => deletePersonnel(item)}></Text>
                    </View>
                  </View>
                )
              })
            }

          </SpScrollView>

          <View className='btn-wrap'>
            <AtButton circle type='primary'
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpages/prescription/add-personnel'
                })
                colsePersonnel()
              }}
            >
              添加用药人
            </AtButton>
          </View>
        </View>
      </AtFloatLayout>
    </View>
  )
}

CompMedicationPersonnel.options = {
  addGlobalClass: true
}

export default CompMedicationPersonnel
