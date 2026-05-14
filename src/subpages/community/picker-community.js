/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpCheckbox } from '@/components'
import { AtButton } from 'taro-ui'
import { pickBy } from '@/utils'
import api from '@/api'
import * as communityApi from '@/api/community'
import doc from '@/subpages/doc'
import { updateSelectCommunityZiti } from '@/store/slices/community'
import { useTranslation, $t } from '@/i18n'
import './picker-community.scss'

const initialState = {
  selection: null,
  list: []
}
function PickerCommunity(props) {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { selectCommunityZiti } = useSelector((state) => state.community)
  const { list, selection } = state
  const dispatch = useDispatch()

  // useEffect(() => {
  //   setState((draft) => {
  //     draft.selection = selectGoods
  //   })
  // }, [])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('7c569259.fc0da6') })
  }, [i18n.language])

  useDidShow(() => {
    fetchZitiList()
  })

  const fetchZitiList = async () => {
    const res = await communityApi.getActivityZiti()
    setState((draft) => {
      draft.list = pickBy(res, doc.community.COMMUNITY_ZITI)
    })
  }

  const onSelectCommunityChange = (item, checked) => {
    dispatch(updateSelectCommunityZiti(item))
    Taro.navigateBack()
  }

  const handleConfirm = () => {
    Taro.navigateTo({
      url: `/subpages/community/community-edit`
    })
  }

  return (
    <SpPage
      className='page-community-picker'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleConfirm}>
            {$t('d6bb96e4.1f6bf1')}
          </AtButton>
        </View>
      }
    >
      <View className='item-list'>
        {list.map((item, index) => (
          <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
            <SpCheckbox
              checked={selectCommunityZiti ? item.id == selectCommunityZiti.id : false}
              onChange={onSelectCommunityChange.bind(this, item)}
            >
              <View className='community-item'>
                <View className='community-location'>{item.area}</View>
                <View className='community-address'>{item.address}</View>
              </View>
            </SpCheckbox>
            <View className='community-item-tools'>
              <Text
                className='iconfont icon-edit'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/subpages/community/community-edit?id=${item.id}`
                  })
                }}
              ></Text>
            </View>
          </View>
        ))}
      </View>
    </SpPage>
  )
}

PickerCommunity.options = {
  addGlobalClass: true
}

export default PickerCommunity
