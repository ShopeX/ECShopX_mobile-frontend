import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpCheckbox, SpScrollView } from '@/components'
import { AtButton } from 'taro-ui'
import { updateSelectGoods } from '@/store/slices/community'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompGoodsItem from './comps/comp-goodsitem'
import './list.scss'

const initialState = {
  list: []
}

function ListIndex(props) {
  const [state, setState] = useImmer(initialState)
  const $instance = getCurrentInstance()
  const { chief_id, distributor_id } = $instance.router.params
  const { list } = state
  const goodsRef = useRef()


  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      page_size: pageSize,
      chief_id,
      distributor_id
    }
    const { total_count: total, list: plist } = await api.community.getMemberItems(params)
    const _plist = pickBy(plist, doc.community.COMMUNITY_GOODS_ITEM)
    setState((draft) => {
      draft.list = [...list, ..._plist]
    })
    return {
      total
    }
  }

  return (
    <SpPage
      className='page-community-list'
    >
      <SpScrollView className='itemlist-scroll' ref={goodsRef} fetch={fetch}>
        {list.map((item, index) => (
          <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
            <CompGoodsItem info={item} />
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

ListIndex.options = {
  addGlobalClass: true
}

export default ListIndex
