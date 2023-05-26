
import React, { useEffect, useRef, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import S from '@/spx'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView, SpSearchBar, SpGoodsItem } from "@/components";
import { pickBy, getDistributorId, classNames } from "@/utils";
import entry from "@/utils/entry";
import doc from '@/doc'
import api from "@/api";

import './item-list.scss'

const initialState = {
  keyword: '',
  rightList: [],
  leftList: []
}

function UgcItemList() {
  const [state, setState] = useImmer(initialState)
  const { keyword, rightList, leftList } = state
  const [selected, setSelected] = useState(new Map())
  const listRef = useRef()

  useEffect(() => {
    listRef.current.reset()
  }, [keyword])

  // 列表
  const fetch = async ({ pageIndex, pageSize }) => {
    const query = {
      page: pageIndex,
      pageSize,
      keywords: keyword,
      item_type: 'normal',
      is_point: 'false',
      approve_status: 'onsale,only_show'
    }
    if (process.env.APP_PLATFORM === 'standard') {
      query.distributor_id = getDistributorId()
    }

    const { list = [], total_count: total } = await api.item.search(query)
    const nList = pickBy(list, doc.goods.ITEM_LIST_GOODS)
    const resLeftList = nList.filter((item, index) => {
      if (index % 2 == 0) {
        return item
      }
    })
    const resRightList = nList.filter((item, index) => {
      if (index % 2 == 1) {
        return item
      }
    })
    setState((draft) => {
      draft.leftList[pageIndex - 1] = resLeftList
      draft.rightList[pageIndex - 1] = resRightList
    })

    return { total: total || 0 }
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.keyword = ''
      draft.leftList = []
      draft.rightList = []
    })
  }

  const handleSearchCancel = () => {
    setState((draft) => {
      draft.keyword = ''
      draft.leftList = []
      draft.rightList = []
    })
  }

  const handleConfirm = async (val) => {
    await setState((draft) => {
      draft.keyword = val
      draft.leftList = []
      draft.rightList = []
    })
  }

  const handleClickItem = ({ itemId, itemName, pic }) => {
    let tempSelected
    if (selected.has(itemId)) {
      selected.delete(itemId)
      tempSelected = new Map([...selected]);
    } else {
      tempSelected = new Map([...selected, [itemId, { itemId, itemName, pic }]]);
    }

    Taro.eventCenter.trigger('onEventRemmendItems', Array.from(tempSelected.values()))
    setSelected(tempSelected);
  }

  const isChecked = ({ itemId }) => {
    return selected.has(itemId)
  }

  return (
    <SpPage scrollToTopBtn className="page-ugc-item-list">
      <SpSearchBar
        keyword={keyword}
        placeholder='搜索商品'
        showDailog={false}
        onFocus={() => { }}
        onChange={() => { }}
        onClear={handleOnClear}
        onCancel={handleSearchCancel}
        onConfirm={handleConfirm}
      />

      <SpScrollView
        className='list-scroll'
        ref={listRef}
        fetch={fetch}
        auto={false}
      >
        <View className="goods-list">
          <View className='left-container'>
            {leftList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className={classNames('goods-item-wrap', {
                  'selected': isChecked(item)
                })} key={`goods-item-l__${idx}_${sidx}`}>
                  <View className='select-item'>
                    <Text className='iconfont icon-gou'></Text>
                  </View>
                  <SpGoodsItem info={item} onClick={handleClickItem.bind(this, item)} />
                </View>
              ))
            })}
          </View>
          <View className='right-container'>
            {rightList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className={classNames('goods-item-wrap', {
                  'selected': isChecked(item)
                })} key={`goods-item-r__${idx}_${sidx}`}>
                  {<View className='select-item'>
                    <Text className='iconfont icon-gou'></Text>
                  </View>}
                  <SpGoodsItem info={item} onClick={handleClickItem.bind(this, item)} />
                </View>
              ))
            })}
          </View>
        </View>
      </SpScrollView>
    </SpPage>
  )

}
export default UgcItemList

