import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtCurtain } from 'taro-ui'
import { SpImage, SpLogin, SpFloatMenuItem } from '@/components'
import api from '@/api'
import S from '@/spx'
import './index.scss'

const initialState = {
  list: [],
  adIndex: 0
}

function SpFloatAd (props) {
  const [state, setState] = useImmer(initialState)
  const { list, adIndex } = state

  useEffect(() => {
    fetchAdList()
  }, [])

  const fetchAdList = async () => {
    const { general, membercard } = await api.promotion.automatic({
      register_type: 'all'
    })
    const list = [{ ...general }, { ...membercard }]
    setState((draft) => {
      draft.list = list.filter((item) => item.is_open == 'true')
    })
  }

  const onCloseAd = () => {
    let curIndex = adIndex + 1
    setState((draft) => {
      draft.adIndex = curIndex
    })
  }

  if (S.getAuthToken()) {
    return null
  }

  return (
    <SpFloatMenuItem className='sp-float-ad'>
      <Text
        className='iconfont icon-present'
        onClick={() => {
          setState((draft) => {
            draft.adIndex = 0
          })
        }}
      ></Text>
      {list.map((item, index) => (
        <AtCurtain
          className={`ad-curtain__${index}`}
          isOpened={index == adIndex}
          onClose={onCloseAd}
          closeBtnPosition='top'
          key={`curtain-item__${index}`}
        >
          <SpLogin>
            <SpImage src={item.ad_pic} mode='widthFix' />
            <View className='ad-ft'>
              <Text className='ad-title'>{item.ad_title}</Text>
            </View>
          </SpLogin>
        </AtCurtain>
      ))}
    </SpFloatMenuItem>
  )
}

SpFloatAd.options = {
  addGlobalClass: true
}

export default SpFloatAd
