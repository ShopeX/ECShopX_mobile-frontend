import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpCheckbox, SpScrollView } from '@/components'
import { AtButton } from 'taro-ui'
import { updateSelectGoods } from '@/store/slices/community'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompGoodsItem from './comps/comp-goodsitem'
import './itemlist.scss'

const initialState = {
  selection: [],
  list: []
}

function ItemList(props) {
  const [state, setState] = useImmer(initialState)
  const { selectGoods } = useSelector((state) => state.community)
  const { list, selection } = state
  const dispatch = useDispatch()
  const goodsRef = useRef()

  useEffect(() => {
    setState((draft) => {
      draft.selection = selectGoods.map((item) => item.itemId)
    })
  }, [])

  const onSelectGoodsChange = ({ itemId }, checked) => {
    const temps = new Set(selection)
    if (temps.has(itemId)) {
      temps.delete(itemId)
    } else {
      temps.add(itemId)
    }

    console.log(`selection:`, Array.from(temps))
    setState((draft) => {
      draft.selection = Array.from(temps)
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      page_size: pageSize
    }
    const { total_count: total, list: plist } = await api.community.getChiefItems(params)
    const _plist = pickBy(plist, doc.community.COMMUNITY_GOODS_ITEM)
    setState((draft) => {
      draft.list = [...list, ..._plist]
    })
    return {
      total
    }
  }

  const handleConfirm = () => {
    const res = list.filter((item) => selection.includes(item.itemId))
    dispatch(updateSelectGoods(res))
    Taro.navigateBack()
  }

  return (
    <SpPage
      className='page-community-itemlist'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleConfirm}>
            确定
          </AtButton>
        </View>
      }
    >
      <SpScrollView className='itemlist-scroll' ref={goodsRef} fetch={fetch}>
        {list.map((item, index) => (
          <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
            <SpCheckbox
              checked={selection.includes(item.itemId)}
              onChange={onSelectGoodsChange.bind(this, item)}
            >
              <CompGoodsItem info={item} />
            </SpCheckbox>
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

ItemList.options = {
  addGlobalClass: true
}

export default ItemList
