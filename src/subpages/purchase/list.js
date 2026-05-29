/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { getCurrentInstance, useDidShow, useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { AtDrawer, AtTabs } from 'taro-ui'
import {
  SpGoodsItem,
  SpSearchBar,
  SpPage,
  SpScrollView,
  SpSelect,
  SpPurchaseEnterpriseBar
} from '@/components'
import { SpFilterBar, SpTagBar, SpDrawer } from '@/subpages/components'
import { fetchUserFavs } from '@/store/slices/user'
import doc from '@/doc'
import api from '@/api'
import {
  pickBy,
  classNames,
  isWeixin,
  getDistributorId,
  styleNames,
  entryLaunch,
  VERSION_STANDARD,
  navigateTo,
  showToast
} from '@/utils'
import S from '@/spx'
import CompPurchaseNav from '@/pages/purchase/comps/comp-purchase-nav'
import CompPurchaseActionbar from '@/subpages/purchase/comps/comp-purchase-actionbar'
import { useTranslation, $t, ti } from '@/i18n'
import './list.scss'

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
  card_id: null, // 兑换券
  goodsTotal: 0,
  navH: 0
}

function ItemList() {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const {
    keywords,
    leftList,
    rightList,
    brandList,
    brandSelect,
    curFilterIdx,
    tagList,
    curTagIdx,
    show,
    fixTop,
    routerParams,
    goodsTotal,
    navH
  } = state
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [enterpriseName, setEnterpriseName] = useState('')
  const router = useRouter()
  const { cat_id, main_cat_id, tag_id, card_id, user_card_id } = routerParams || {}
  const { shopInfo } = useSelector((state) => state.shop)
  const {
    purchase_share_info = {},
    curDistributorId,
    curEnterpriseId,
    cartCount = 0
  } = useSelector((state) => state.purchase)
  const dispatch = useDispatch()

  const filterList = useMemo(
    () => [
      { title: $t('ddb371f2.88e7de') },
      { title: $t('ddb371f2.44e7eb') },
      { title: $t('e7972c3f.2249e3'), icon: 'icon-shengxu-01' },
      { title: $t('e7972c3f.a9f9e6'), icon: 'icon-jiangxu-01' }
    ],
    [i18n.language]
  )

  const goodsRef = useRef()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('ddb371f2.437974') })
  }, [i18n.language])
  // console.log('$instance?.router?.params', $instance?.router?.params)
  useEffect(() => {
    if (S.getAuthToken()) {
      dispatch(fetchUserFavs())
    }
  }, [])

  useEffect(() => {
    // card_id, user_card_id: 兑换券参数
    entryLaunch.getRouteParams($instance?.router?.params).then((params) => {
      const { cat_id, main_cat_id, tag_id, card_id, user_card_id } = params

      setState((draft) => {
        draft.routerParams = {
          cat_id,
          main_cat_id,
          tag_id,
          card_id,
          user_card_id
        }
      })
    })
  }, [])

  useEffect(() => {
    if (routerParams) {
      goodsRef.current.reset()
    }
  }, [routerParams])

  useEffect(() => {
    const eid =
      curEnterpriseId || router?.params?.enterprise_id || purchase_share_info?.enterprise_id
    if (!eid) {
      setEnterpriseName('')
      return
    }
    const loadEnterpriseName = async () => {
      try {
        const data = await api.purchase.getUserEnterprises({
          disabled: 0,
          distributor_id: getDistributorId()
        })
        const found = data?.find((x) => x.enterprise_id == eid)
        setEnterpriseName(found?.name || found?.enterprise_name || '')
      } catch (e) {
        setEnterpriseName('')
      }
    }
    loadEnterpriseName()
  }, [curEnterpriseId, router?.params?.enterprise_id, purchase_share_info?.enterprise_id])

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
    const { activity_id } = purchase_share_info
    // card_id: 兑换券id
    // const { cat_id, main_cat_id, tag_id, card_id } = $instance?.router?.params
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
      card_id,
      activity_id
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
      params.distributor_id =
        curDistributorId ?? (card_id ? shopInfo?.distributor_id : getDistributorId())
    }

    const {
      list,
      total_count,
      select_tags_list = [],
      brand_list
    } = await api.purchase.getPurchaseActivityItems(params)
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
      v.goodsTotal = typeof total_count === 'number' ? total_count : 0
      v.leftList[pageIndex - 1] = resLeftList
      v.rightList[pageIndex - 1] = resRightList
      v.brandList = pickBy(brand_list?.list, doc.goods.WGT_GOODS_BRAND)
      if (select_tags_list.length > 0) {
        v.tagList = [
          {
            tag_name: $t('f1d3181c.a8b0c2'),
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

  const onActionBarCart = useCallback(() => {
    navigateTo('/subpages/purchase/espier-index?tabbar=0')
  }, [])

  const onActionBarShare = useCallback(() => {
    if (!purchase_share_info?.activity_id) {
      showToast($t('307aead5.343490'))
      return
    }
    if (purchase_share_info.surplus_share_limitnum == '0') {
      Taro.showToast({ title: $t('63b11dbe.ce0559'), icon: 'none' })
      return
    }
    navigateTo('/subpages/purchase/share')
  }, [purchase_share_info])

  const onActionBarQuota = useCallback(() => {
    showToast($t('e7972c3f.ed8646'))
  }, [])

  return (
    <SpPage
      scrollToTopBtn
      title={$t('ddb371f2.437974')}
      pageConfig={{ navigateBackgroundColor: '#ffffff' }}
      renderNavigation={(navProps) => <CompPurchaseNav {...navProps} />}
      className={classNames('page-item-list', 'has-navbar', {
        'has-tagbar': tagList.length > 0,
        'page-item-list--with-store': VERSION_STANDARD && !!card_id
      })}
      onReady={({ gNavbarH }) => {
        setState((draft) => {
          draft.navH = gNavbarH
        })
      }}
    >
      <View className='purchase-list-top-fixed' style={{ top: `${navH}px` }}>
        {VERSION_STANDARD && card_id && (
          <View
            className='purchase-list-top-fixed__store'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpages/store/list'
              })
            }}
          >
            <View className='shop-name'>{shopInfo.store_name || $t('e3bdb7a0.895d7d')}</View>
            <Text className='iconfont icon-qianwang-01'></Text>
          </View>
        )}
        <SpPurchaseEnterpriseBar name={enterpriseName} showSearch={false} />
        <View className='purchase-list-top-fixed__search'>
          <SpSearchBar
            keyword={keywords}
            placeholder={$t('bfcc0b96.2470ef')}
            onFocus={handleOnFocus}
            onChange={handleOnChange}
            onClear={handleOnClear}
            onCancel={handleSearchOff}
            onConfirm={handleConfirm}
          />
        </View>
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
          className='purchase-sort-bar'
          current={curFilterIdx}
          list={filterList}
          onChange={handleFilterChange}
        >
          <View
            className='purchase-sort-bar__filter-trigger'
            onClick={() => {
              setState((draft) => {
                draft.show = true
              })
            }}
          >
            <Text className='iconfont icon-shaixuan-01' />
          </View>
        </SpFilterBar>
      </View>
      <SpScrollView className='item-list-scroll' auto={false} ref={goodsRef} fetch={fetch}>
        <View className='purchase-goods-total-wrap'>
          <View className='purchase-goods-total-wrap__divider' />
          <Text className='purchase-goods-total-wrap__label'>
            {ti('e7972c3f.176444', [goodsTotal])}
          </Text>
        </View>
        <View className='goods-list'>
          <View className='left-container'>
            {leftList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className='goods-item-wrap' key={`goods-item-l__${idx}_${sidx}`}>
                  <SpGoodsItem
                    onStoreClick={handleClickStore}
                    isPurchase
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
                    onStoreClick={handleClickStore}
                    isPurchase
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

      <SpDrawer
        show={show}
        onClose={() => {
          setState((v) => {
            v.show = false
          })
        }}
        onConfirm={onConfirmBrand}
        onReset={onResetBrand}
      >
        <View className='brand-title'>{$t('e7972c3f.09307c')}</View>
        <SpSelect multiple info={brandList} value={brandSelect} onChange={onChangeBrand} />
      </SpDrawer>

      <CompPurchaseActionbar
        fixed
        cartCount={cartCount}
        onCart={onActionBarCart}
        onShare={onActionBarShare}
        onQuota={onActionBarQuota}
      />
    </SpPage>
  )
}

export default ItemList
