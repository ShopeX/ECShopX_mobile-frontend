/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useRef, useEffect, useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import throttle from 'lodash/throttle'
import { SpGoodsItem, SpSearchBar, SpPage, SpScrollView, SpSelect, SpSkuSelect } from '@/components'
import { SpFilterBar, SpTagBar, SpDrawer } from '@/subpages/components'
import { fetchUserFavs } from '@/store/slices/user'
import doc from '@/doc'
import api from '@/api'
import {
  pickBy,
  classNames,
  getDistributorId,
  entryLaunch,
  VERSION_STANDARD,
  showToast
} from '@/utils'
import S from '@/spx'
import { $t, useTranslation } from '@/i18n'

import FloatSalesperson from '@/subpages/store/comps/float-salesperson'

import './list.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
  leftList: [],
  rightList: [],
  brandList: [],
  brandSelect: [],
  curFilterIdx: 0,
  tagList: [],
  curTagIdx: 0,
  keywords: '',
  show: false,
  fixTop: 0,
  routerParams: null,
  skuPanelOpen: false,
  info: null,
  selectType: 'picker',
  card_id: null, // 兑换券
  backTopScrollTop: 0
}

function ItemList() {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const {
    keywords,
    leftList,
    rightList,
    selectType,
    skuPanelOpen,
    brandSelect,
    curFilterIdx,
    tagList,
    curTagIdx,
    info,
    fixTop,
    routerParams
  } = state
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { cat_id, main_cat_id, tag_id, card_id, user_card_id } = routerParams || {}
  const { shopInfo } = useSelector((state) => state.shop)
  const dispatch = useDispatch()

  const goodsRef = useRef()
  const pageRef = useRef()

  const hydrateListActivities = async (list = []) => {
    const items = await Promise.all(
      list.map(async (item) => {
        if (item.activityType || item.activityInfo) return item
        try {
          const detail = await api.item.detail(item.itemId, {
            showError: false,
            distributor_id: item.distributorId || getDistributorId()
          })
          return {
            ...item,
            activityType: detail.activity_type,
            activityInfo: detail.activity_info,
            promotion: item.promotion || detail.promotion_activity || []
          }
        } catch (e) {
          return item
        }
      })
    )
    return items
  }
  const filterListForView = useMemo(
    () => [
      { title: $t('ddb371f2.88e7de') },
      { title: $t('ddb371f2.44e7eb') },
      { title: $t('ddb371f2.0e9fd9'), icon: 'icon-shengxu-01' },
      { title: $t('ddb371f2.0e9fd9'), icon: 'icon-jiangxu-01' }
    ],
    [i18n.language]
  )

  const tagListForView = useMemo(
    () =>
      tagList.map((item) =>
        item.tag_id === 0 ? { ...item, tag_name: $t('f1d3181c.a8b0c2') } : item
      ),
    [tagList, i18n.language]
  )

  // console.log('$instance?.router?.params', $instance?.router?.params)
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('ddb371f2.437974') })
  }, [i18n.language])

  useEffect(() => {
    if (S.getAuthToken()) {
      dispatch(fetchUserFavs())
    }
  }, [])

  useEffect(() => {
    // card_id, user_card_id: 兑换券参数
    entryLaunch.getRouteParams($instance?.router?.params).then((params) => {
      const { cat_id, keywords, main_cat_id, tag_id, card_id, user_card_id, all = false } = params

      setState((draft) => {
        draft.routerParams = {
          cat_id,
          keywords,
          main_cat_id,
          tag_id,
          card_id,
          user_card_id,
          all
        }
        draft.keywords = keywords
      })
    })
  }, [])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  useEffect(() => {
    if (routerParams) {
      goodsRef.current.reset()
    }
  }, [routerParams])

  useEffect(() => {
    if (shopInfo && card_id) {
      goodsRef.current.reset()
    }
  }, [shopInfo])

  const fetch = async ({ pageIndex, pageSize }) => {
    // card_id: 兑换券id
    const { mcid, cid } = $instance?.router?.params
    let params = {
      page: pageIndex,
      pageSize,
      brand_id: brandSelect,
      keywords: keywords,
      approve_status: 'onsale,only_show',
      item_type: 'normal',
      is_point: 'false',
      tag_id,
      card_id
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

    if (cat_id || cid) {
      params['category'] = cat_id || cid
    }

    if (main_cat_id || mcid) {
      params['main_category'] = main_cat_id || mcid
    }

    if (VERSION_STANDARD) {
      // if (all) {
      //   //如果从平铺分类跳转过来就查询所有的商品
      //   params.distributor_id = 0
      // } else {
      // 有兑换券的时候，店铺ID传当前选中的店铺
      params.distributor_id = card_id ? shopInfo?.distributor_id : getDistributorId()
      // }
    }

    const { list, total_count, select_tags_list = [], brand_list } = await api.item.search(params)
    console.time('list render')
    const n_list = await hydrateListActivities(pickBy(list, doc.goods.ITEM_LIST_GOODS))
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
    console.timeEnd('list render')

    setState((v) => {
      v.leftList[pageIndex - 1] = resLeftList
      v.rightList[pageIndex - 1] = resRightList
      v.brandList = pickBy(brand_list?.list, doc.goods.WGT_GOODS_BRAND)
      if (v.tagList.length < 1) {
        if (select_tags_list.length > 0) {
          v.tagList = [
            {
              tag_name: '',
              tag_id: 0
            }
          ].concat(select_tags_list)
          v.fixTop = fixTop + 34
        }
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

  const handleSearchOff = async () => {
    setIsShowSearch(false)
    await setState((v) => {
      v.keywords = ''
    })
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

  const handleClickStore = (item) => {
    const url = `/subpages/store/index?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  const handleAddToCart = async ({ itemId, distributorId }) => {
    try {
      Taro.showLoading()
      const itemDetail = await api.item.detail(itemId, {
        showError: false,
        distributor_id: distributorId
      })
      Taro.hideLoading()
      setState((draft) => {
        draft.info = pickBy(itemDetail, doc.goods.GOODS_INFO)
        draft.skuPanelOpen = true
        draft.selectType = 'addcart'
      })
    } catch (e) {
      showToast(e.message)
      Taro.hideLoading()
    }
  }

  return (
    <SpPage
      scrollToTopBtn
      className={classNames('page-item-list', 'page-item-list--page-scroll', {
        'has-tagbar': tagList.length > 0
      })}
      ref={pageRef}
      title='商品列表'
      renderFloat={<FloatSalesperson />}
    >
      <View className='search-wrap'>
        {/* {VERSION_STANDARD && card_id && (
          <View
            className='store-picker'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpages/store/list'
              })
            }}
          >
            <View className='shop-name'>{shopInfo.store_name || '暂无店铺信息'}</View>
            <Text className='iconfont icon-qianwang-01'></Text>
          </View>
        )} */}
        <SpSearchBar
          keyword={keywords}
          placeholder={$t('ddb371f2.e5f71f')}
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleSearchOff}
          onConfirm={handleConfirm}
        />
      </View>
      <View className='item-list-head'>
        {tagList.length > 0 && (
          <SpTagBar
            className='tag-list'
            list={tagListForView}
            value={curTagIdx}
            onChange={onChangeTag}
          />
        )}

        <SpFilterBar
          custom
          current={curFilterIdx}
          list={filterListForView}
          onChange={handleFilterChange}
        />
      </View>
      <SpScrollView className='item-list-scroll' auto={false} ref={goodsRef} fetch={fetch}>
        <View className='goods-list'>
          <View className='left-container'>
            {leftList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className='goods-item-wrap' key={`goods-item-l__${idx}_${sidx}`}>
                  <SpGoodsItem
                    showFav
                    showAddCart
                    onStoreClick={handleClickStore}
                    onAddToCart={handleAddToCart}
                    info={{
                      ...item,
                      card_id,
                      user_card_id
                    }}
                  />
                </View>
              ))
            })}
          </View>
          <View className='right-container'>
            {rightList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className='goods-item-wrap' key={`goods-item-r__${idx}_${sidx}`}>
                  <SpGoodsItem
                    showFav
                    showAddCart
                    onStoreClick={handleClickStore}
                    onAddToCart={handleAddToCart}
                    info={{
                      ...item,
                      card_id,
                      user_card_id
                    }}
                  />
                </View>
              ))
            })}
          </View>
        </View>
        {/* Sku选择器 */}
        <MSpSkuSelect
          open={skuPanelOpen}
          type={selectType}
          info={info}
          onClose={() => {
            setState((draft) => {
              draft.skuPanelOpen = false
            })
          }}
          onChange={(skuText, curItem) => {
            setState((draft) => {
              draft.skuText = skuText
              draft.curItem = curItem
            })
          }}
        />
      </SpScrollView>
    </SpPage>
  )
}

export default ItemList
