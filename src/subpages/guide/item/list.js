import React, { useRef, useEffect, useState } from 'react'
import { useSelector, connect } from 'react-redux'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, getCurrentInstance } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer, AtTabs } from 'taro-ui'
import {
  BackToTop,
  Loading,
  TagsBar,
  SpFilterBar,
  SearchBar,
  GoodsItem,
  SpTagBar,
  SpGoodsItem,
  SpSearchBar,
  SpNote,
  SpNavBar,
  SpLoadMore,
  TabBar,
  SpPage,
  SpScrollView,
  SpDrawer,
  SpSelect
} from '@/components'
import doc from '@/doc'
import api from '@/api'
import { pickBy, classNames, isWeixin, isWeb, styleNames } from '@/utils'
import {
  BaHomeWgts,
  BaStoreList,
  BaStore,
  BaGoodsBuyPanel,
  BaTabBar,
  BaNavBar
} from '@/subpages/guide/components'

import './list.scss'

const initialState = {
  leftList: [],
  rightList: [],
  brandList: [],
  brandSelect: [],
  filterList: [
    { title: '综合' },
    { title: '销量' },
    { title: '价格', icon: 'icon-shengxu-01' },
    { title: '价格', icon: 'icon-jiangxu-01' }
  ],
  curFilterIdx: 0,
  tagList: [],
  curTagIdx: 0,
  keywords: '',
  show: false,
  fixTop: 0
}

function ItemList(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const {
    keywords,
    leftList,
    rightList,
    brandList,
    brandSelect,
    curFilterIdx,
    filterList,
    tagList,
    curTagIdx,
    show,
    fixTop
  } = state
  const { storeInfo } = useSelector((state) => state.guide)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const goodsRef = useRef()

  useEffect(() => {}, [])

  useDidShow(() => {
    setTimeout(() => {
      Taro.createSelectorQuery()
        .select('#item-list-head')
        .boundingClientRect((res) => {
          console.log('boundingClientRect:', res) //
          if (res) {
            setState((draft) => {
              draft.fixTop = res.bottom
              console.log('fixTop:', res.bottom) //
            })
          }
        })
        .exec()
    }, 200)
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    const { cat_id } = $instance.router.params
    let params = {
      page: pageIndex,
      pageSize,
      brand_id: brandSelect,
      keywords: keywords,
      approve_status: 'onsale,only_show',
      item_type: 'normal',
      is_point: 'false',
      distributor_id: storeInfo?.distributor_id
    }

    if (curFilterIdx == 1) {
      // 销量
      params['goodsSort'] = 1
    } else if (curFilterIdx == 2) {
      // 价格升序
      params['goodsSort'] = 3
    } else if (curFilterIdx == 3) {
      // 价格降序
      params['goodsSort'] = 2
    }

    if (curTagIdx) {
      params['tag_id'] = curTagIdx
    }

    if (cat_id) {
      params['category'] = cat_id
    }

    const {
      list,
      total_count,
      item_params_list = [],
      select_tags_list = [],
      brand_list
    } = await api.guide.salespersonItems(params)
    const n_list = pickBy(list, doc.goods.ITEM_LIST_GOODS)
    const resLeftList = n_list.filter((item, index) => {
      if (index % 2 == 0) {
        return item
      }
    })
    const resRightList = n_list.filter((item, index) => {
      if (index % 2 == 1) {
        return item
      }
    })

    setState((v) => {
      v.leftList = [...v.leftList, ...resLeftList]
      v.rightList = [...v.rightList, ...resRightList]
      v.brandList = pickBy(brand_list?.list, doc.goods.WGT_GOODS_BRAND)
      if (select_tags_list.length > 0) {
        v.tagList = [
          {
            tag_name: '全部',
            tag_id: 0
          }
        ].concat(select_tags_list)
      }
    })

    return { total: total_count }
  }

  const handleOnFocus = () => {
    setIsShowSearch(true)
  }

  const handleOnChange = (val) => {
    setState((v) => {
      v.keywords = val
    })
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.keywords = ''
    })
    setIsShowSearch(false)
    goodsRef.current.reset()
  }

  const handleSearchOff = () => {
    setIsShowSearch(false)
  }

  const handleConfirm = async (val) => {
    setIsShowSearch(false)
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.keywords = val
    })
    goodsRef.current.reset()
  }

  const onChangeTag = async (index, item) => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curTagIdx = item.tag_id
    })
    goodsRef.current.reset()
  }

  const handleFilterChange = async (e) => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curFilterIdx = e.current || 0
    })
    goodsRef.current.reset()
  }

  const onChangeBrand = (val) => {
    setState((draft) => {
      draft.brandSelect = val
    })
  }

  const onConfirmBrand = async () => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.show = false
    })
    goodsRef.current.reset()
  }

  const onResetBrand = async () => {
    await setState((draft) => {
      draft.brandSelect = []
      draft.leftList = []
      draft.rightList = []
      draft.show = false
    })
    goodsRef.current.reset()
  }

  const handleClickItem = ({ itemId, distributorId }) => {
    const url = `/subpages/guide/item/espier-detail?id=${itemId}&dtid=${distributorId}`
    Taro.navigateTo({
      url
    })
  }

  // query.exec()

  // wx.createSelectorQuery().select('#item-list-head').boundingClientRect(res => {
  //   console.log('boundingClientRect:', res) //
  // }).exec()
  return (
    <SpPage
      scrollToTopBtn
      className={classNames('page-item-list', {
        'has-tagbar': tagList.length > 0
      })}
    >
      <View id='item-list-head' className='item-list-head'>
        {/* <BaNavBar home title='导购商城' /> */}
        <View className='search-wrap'>
          <SpSearchBar
            keyword={keywords}
            placeholder='搜索'
            onFocus={handleOnFocus}
            onChange={handleOnChange}
            onClear={handleOnClear}
            onCancel={handleSearchOff}
            onConfirm={handleConfirm}
          />
        </View>
        {tagList.length > 0 && (
          <SpTagBar
            className='tag-list'
            list={tagList}
            value={curTagIdx}
            onChange={onChangeTag}
          ></SpTagBar>
        )}

        <SpFilterBar
          custom
          current={curFilterIdx}
          list={filterList}
          onChange={handleFilterChange}
        />
      </View>
      <SpScrollView
        className='item-list-scroll'
        style={styleNames({
          top: `${fixTop}px`
        })}
        ref={goodsRef}
        fetch={fetch}
      >
        <View className='goods-list'>
          <View className='left-container'>
            {leftList.map((item, index) => (
              <View className='goods-item-wrap' key={`goods-item__${index}`}>
                <SpGoodsItem hideStore info={item} onClick={handleClickItem.bind(this, item)} />
              </View>
            ))}
          </View>
          <View className='right-container'>
            {rightList.map((item, index) => (
              <View className='goods-item-wrap' key={`goods-item__${index}`}>
                <SpGoodsItem hideStore info={item} onClick={handleClickItem.bind(this, item)} />
              </View>
            ))}
          </View>
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default ItemList
