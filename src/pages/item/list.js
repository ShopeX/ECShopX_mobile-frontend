import React, { useRef, useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import { AtDrawer, AtTabs } from 'taro-ui'
import {
  SpFilterBar,
  SpTagBar,
  SpGoodsItem,
  SpSearchBar,
  SpPage,
  SpScrollView,
  SpDrawer,
  SpSelect
} from '@/components'
import doc from '@/doc'
import qs from 'qs'
import api from '@/api'
import {
  pickBy,
  classNames,
  isWeixin,
  getDistributorId,
  styleNames,
  normalizeQuerys,
  VERSION_STANDARD
} from '@/utils'

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
  fixTop: 0,
  routerParams: null,
  card_id: null // 兑换券
}

function ItemList() {
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
    fixTop,
    routerParams
  } = state
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { cat_id, main_cat_id, tag_id, card_id, user_card_id } = routerParams || {}
  const { shopInfo } = useSelector((state) => state.shop)

  const goodsRef = useRef()
  // console.log('$instance.router.params', $instance.router?.params)

  useEffect(() => {
    // card_id, user_card_id: 兑换券参数
    const { cat_id, main_cat_id, tag_id, card_id, user_card_id, scene = '' } = $instance.router.params

    let cid = cat_id

    if (scene) {
      const query = qs.parse(decodeURIComponent(scene))
      cid = query.cat_id
    }
    setState((draft) => {
      draft.routerParams = {
        cat_id : cid,
        main_cat_id,
        tag_id,
        card_id,
        user_card_id
      }
    })
  }, [])

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

  useDidShow(() => {
    // setTimeout(() => {
    //   if (isWeixin) {
    //     Taro.createSelectorQuery()
    //       .select('#item-list-head')
    //       .boundingClientRect((res) => {
    //         console.log('boundingClientRect:', res) //
    //         if (res) {
    //           setState((draft) => {
    //             draft.fixTop = res.bottom
    //             console.log('fixTop1:', res.bottom) //
    //           })
    //         }
    //       })
    //       .exec()
    //   } else {
    //     Taro.createSelectorQuery()
    //       .select('#item-list-head')
    //       .boundingClientRect((res) => {
    //         console.log('boundingClientRect:', res) //
    //         if (res) {
    //           setState((draft) => {
    //             draft.fixTop = res.bottom
    //             console.log('fixTop2:', res.bottom) //
    //           })
    //         }
    //       })
    //       .exec()
    //     // setState((draft) => {
    //     //   draft.fixTop = document.getElementById('item-list-head').clientHeight
    //     //   console.log('fixTop2:', document.getElementById('item-list-head').clientHeight) //
    //     // })
    //   }
    // }, 1000)
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    // card_id: 兑换券id
    // const { cat_id, main_cat_id, tag_id, card_id } = $instance.router.params
    console.log(shopInfo)
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

    if (cat_id) {
      params['category'] = cat_id
    }

    if (main_cat_id) {
      params['main_category'] = main_cat_id
    }

    if (VERSION_STANDARD) {
      // 有兑换券的时候，店铺ID传当前选中的店铺
      params.distributor_id = card_id ? shopInfo?.distributor_id : getDistributorId()
    }

    const {
      list,
      total_count,
      item_params_list = [],
      select_tags_list = [],
      brand_list
    } = await api.item.search(params)
    console.time('list render')
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
    console.timeEnd('list render')

    setState((v) => {
      v.leftList[pageIndex - 1] = resLeftList
      v.rightList[pageIndex - 1] = resRightList
      v.brandList = pickBy(brand_list?.list, doc.goods.WGT_GOODS_BRAND)
      if (select_tags_list.length > 0) {
        v.tagList = [
          {
            tag_name: '全部',
            tag_id: 0
          }
        ].concat(select_tags_list)
        v.fixTop = fixTop + 34
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

  const handleClickStore = (item) => {
    const url = `/subpages/store/index?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  }
  return (
    <SpPage
      scrollToTopBtn
      className={classNames('page-item-list', {
        'has-tagbar': tagList.length > 0
      })}
    >
      <View className='search-wrap'>
        {/* 兑换券选择店铺 */}
        {VERSION_STANDARD && card_id && (
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
        )}
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
      <View className='item-list-head'>
        {tagList.length > 0 && (
          <SpTagBar className='tag-list' list={tagList} value={curTagIdx} onChange={onChangeTag}>
            {/* <View
            className="filter-btn"
            onClick={() => {
              setState(v => {
                v.show = true;
              });
            }}
          >
            筛选<Text className="iconfont icon-filter"></Text>
          </View> */}
          </SpTagBar>
        )}

        <SpFilterBar
          custom
          current={curFilterIdx}
          list={filterList}
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
                    onStoreClick={handleClickStore}
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
                    onStoreClick={handleClickStore}
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
      </SpScrollView>

      {/* <SpDrawer
        show={show}
        onClose={() => {
          setState(v => {
            v.show = false;
          });
        }}
        onConfirm={onConfirmBrand}
        onReset={onResetBrand}
      >
        <View className="brand-title">品牌</View>
        <SpSelect
          multiple
          info={brandList}
          value={brandSelect}
          onChange={onChangeBrand}
        />
      </SpDrawer> */}
    </SpPage>
  )
}

export default ItemList
