/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState, useRef, useCallback } from 'react'
import Taro, {
  useShareAppMessage,
  useShareTimeline,
  useDidShow,
  getCurrentInstance
} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import { SG_ROUTER_PARAMS } from '@/consts'
import S from '@/spx'
import {
  SpFloatMenuItem,
  SpPage,
  SpSearch,
  SpRecommend,
  SpFloatLayout,
  SpSkuSelect,
  SpLogin
} from '@/components'
import api from '@/api'
import doc from '@/doc'
import {
  isWeixin,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  VERSION_B2C,
  classNames,
  entryLaunch,
  pickBy,
  log,
  showToast,
  buildSharePath
} from '@/utils'
import { useImmer } from 'use-immer'
import { useNavigation, useDebounce } from '@/hooks'
import _toString from 'lodash/toString'
import qs from 'qs'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import {
  updateShopCartCount,
  fetchCartList,
  updateCount,
  updateCartItemNum,
  deleteCartItem
} from '@/store/slices/cart'
import CompTabbar from './comps/comp-tabbar'
import CompShopBrand from './comps/comp-shopbrand'
import Categorys from './categorys'
import CompTab from './comps/comp-tab'
import CompAddCart from './comps/comp-add-cart'

import './index.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initState = {
  wgts: [],
  showBackToTop: false,
  loading: true,
  isDefault: false,
  storeInfo: null,
  distributorId: 0,
  productSwitching: true,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker',
  statusBarHeight: '',
  open: false,
  hideClose: true
}

function StoreIndex() {
  const [state, setState] = useImmer(initState)
  const [likeList, setLikeList] = useImmer([])
  const { openRecommend, colorPrimary } = useSelector((state) => state.sys)
  const { shopCartCount } = useSelector((state) => state.cart)
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance()
  const router = $instance.router

  const {
    wgts,
    loading,
    isDefault,
    distributorId,
    productSwitching,
    storeInfo,
    info,
    skuPanelOpen,
    selectType,
    statusBarHeight,
    open,
    hideClose
  } = state

  const dispatch = useDispatch()
  const pageRef = useRef()
  const loginRef = useRef()

  useDidShow(() => {
    fetchWgts()
    init()
    salesmanShare()
  })

  // useEffect(() => {
  //   fetchWgts()
  //   init()
  // }, [])

  useEffect(() => {
    if (S.getAuthToken()) {
      fetchWgts()
      salesmanShare()
    }
  }, [S.getAuthToken()])

  useEffect(() => {
    if (skuPanelOpen || open) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen, open])

  const salesmanShare = async () => {
    let params = await parameter()

    if (params?.qr == 'Y') {
      let param = {
        promoter_user_id: params?.uid,
        promoter_shop_id: params?.dtid || params?.id
      }
      await api.salesman.salespersonBindusersalesperson(param)
      Taro.setStorageSync('salesmanUserinfo', param)
      console.log(param, '分享成功，业务员已存储3')
    }
  }

  const parameter = async () => {
    const storedData = Taro.getStorageSync(SG_ROUTER_PARAMS)
    // 检查是否返回了非空对象
    // if (storedData && typeof storedData === 'object' && Object.keys(storedData).length > 0) {
    //   return storedData
    // } else {
    const routeParams = await entryLaunch.getRouteParams()
    return routeParams && (routeParams.id || routeParams.dtid || routeParams.uid)
      ? routeParams
      : storedData

    // if (routeParams?.id || routeParams?.dtid || routeParams?.uid) {
    //   return routeParams
    // }else{
    //   return storedData
    // }
    // return routeParams
    // }
  }

  const init = async () => {
    const { statusBarHeight } = await Taro.getSystemInfoSync()
    setState((draft) => {
      draft.statusBarHeight = statusBarHeight
    })
    console.log('MenuButton:', statusBarHeight)
  }

  const fetchWgts = async () => {
    const { id, dtid, uid } = await parameter()

    const distributor_id = getDistributorId(id || dtid || uid)
    const { status } = await api.distribution.merchantIsvaild({
      distributor_id
    })

    if (!status) {
      setState((draft) => {
        draft.isDefault = true
      })
      return
    } else {
      const storeInfo = await api.shop.getShop({
        distributor_id,
        show_score: 1,
        show_marketing_activity: 1
      })
      const { config } = await api.shop.getStoreShopTemplate({
        distributor_id
      })
      setState((draft) => {
        draft.wgts = config
        draft.distributorId = distributor_id
        draft.storeInfo = pickBy(storeInfo, doc.shop.STORE_INFO)
        draft.loading = false
      })
      await shopping(distributor_id)
    }
  }

  const shopping = async (distributor_id) => {
    let params = {
      distributor_id,
      shop_type: 'distributor'
    }
    const { valid_cart } = await api.cart.get(params)
    let shopCats = {
      shop_id: valid_cart === undefined ? '' : valid_cart[0]?.shop_id || '', //下单
      cart_total_num: valid_cart === undefined ? '' : valid_cart[0]?.cart_total_num || '', //数量
      total_fee: valid_cart === undefined ? '' : valid_cart[0]?.total_fee || '', //实付金额
      discount_fee: valid_cart === undefined ? '' : valid_cart[0]?.discount_fee || '', //优惠金额
      storeDetails: valid_cart === undefined ? '' : valid_cart[0] || {}
    }
    dispatch(updateShopCartCount(shopCats))
  }

  const fetchLikeList = async () => {
    if (openRecommend == 1) {
      const query = {
        page: 1,
        pageSize: 30
      }
      const { list } = await api.cart.likeList(query)
      setLikeList(list)
    }
  }

  useShareAppMessage((res) => {
    return getAppShareInfo()
  })

  useShareTimeline((res) => {
    return getAppShareInfo()
  })

  const tabbarSwitching = (val) => {
    setState((draft) => {
      draft.productSwitching = val
    })
  }

  const addPurchases = async (id) => {
    let data
    Taro.showLoading({
      title: '加载中'
    })
    const { dtid } = await parameter()
    const itemDetail = await api.item.detail(id, {
      showError: false,
      distributor_id: dtid
    })
    Taro.hideLoading()
    data = pickBy(itemDetail, doc.goods.GOODS_INFO)
    setState((draft) => {
      draft.info = {
        ...data
      }
    })
    // 获取商品详情的接口
    setState((draft) => {
      draft.skuPanelOpen = true
      draft.selectType = 'addcart'
    })
  }

  const getAppShareInfo = async () => {
    const data = await parameter()
    const dtid = data.id || data.dtid
    const query = {
      dtid
    }
    const path = buildSharePath('poster_store_index', query)
    log.debug(`share path: ${path}`)
    return {
      title: storeInfo?.name,
      imageUrl: storeInfo?.logo,
      path
    }
  }

  const onAddToCart = async ({ itemId }) => {
    Taro.showLoading()
    try {
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
      Taro.hideLoading({
        success: () => {
          showToast(e.message)
        }
      })
    }
  }

  // const settlement = () => {
  //   const { type = 'distributor' } = router.params
  //   const { shop_id, is_delivery, is_ziti, shop_name, address, lat, lng, hour, mobile } =
  //     shopCartCount.storeDetails
  //   const query = {
  //     cart_type: 'cart',
  //     type,
  //     shop_id,
  //     is_delivery,
  //     is_ziti,
  //     name: shop_name,
  //     store_address: address,
  //     lat,
  //     lng,
  //     hour,
  //     phone: mobile,
  //     //购物车默认是0     0:普通商品  1:跨境商品
  //     // goodType: current == 0 ? 'normal' : 'cross'
  //     goodType: 'normal'
  //   }
  //   Taro.navigateTo({
  //     url: `/pages/cart/espier-checkout?${qs.stringify(query)}`
  //   })
  // }

  //显示弹框
  const popFrame = () => {
    if (!S.getAuthToken()) {
      loginRef.current?.handleToLogin()
      return
    }
    if (shopCartCount.storeDetails?.list?.length > 0) {
      setState((draft) => {
        draft.open = true
      })
    } else {
      showToast('购物车暂无数据，请先加购')
    }
  }

  let searchComp = wgts.find((wgt) => wgt.name == 'search')
  const pageData = wgts.find((wgt) => wgt.name == 'page')
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search')
  } else {
    filterWgts = wgts
    searchComp = null
  }
  // const fixedTop = searchComp && searchComp.config.fixTop

  return (
    <SpPage
      className='page-store-index'
      isDefault={isDefault}
      defaultMsg='该店铺已注销，在别的店铺看看吧'
      loading={loading}
      scrollToTopBtn
      ref={pageRef}
      // navigateMantle
      pageConfig={pageData?.base}
      // renderTitle={
      //   fixedTop && (
      //     <>
      //     <SpSearch
      //       isFixTop={searchComp.config.fixTop}
      //       onClick={() => {
      //         Taro.navigateTo({
      //           url: `/subpages/store/item-list?dtid=${distributorId}`
      //         })
      //       }}
      //     />
      //     </>

      //   )
      // }
      renderFloat={
        <View>
          <SpFloatMenuItem
            onClick={() => {
              Taro.navigateTo({ url: '/subpages/member/index' })
            }}
          >
            <Text className='iconfont icon-huiyuanzhongxin'></Text>
          </SpFloatMenuItem>
          <SpFloatMenuItem
            onClick={() => {
              Taro.navigateTo({ url: '/pages/cart/espier-index' })
            }}
          >
            <Text className='iconfont icon-gouwuche'></Text>
          </SpFloatMenuItem>
        </View>
      }
      renderFooter={<CompTab popFrame={popFrame} />}
    >
      {searchComp && (
        <View className='search'>
          <SpSearch
            // isFixTop={searchComp?.config?.fixTop}
            info={searchComp}
            onClick={() => {
              Taro.navigateTo({
                url: `/subpages/store/item-list?dtid=${distributorId}`
              })
            }}
          />
        </View>
      )}

      <View
        className={searchComp ? 'header-block' : 'header-block-pad'}
        style={{ background: `${pageData?.base?.pageBackgroundColor}` }}
      >
        <CompShopBrand storeInfo={storeInfo} dtid={distributorId} />
      </View>

      <View
        className='switchs'
        style={{
          background: `${pageData?.base?.pageBackgroundColor || '#fff'}`,
          top: `${statusBarHeight + 40}px`
        }}
      >
        <Text
          className={classNames(productSwitching ? 'switchings' : 'switching')}
          onClick={() => tabbarSwitching(true)}
        >
          首页
        </Text>
        <Text
          className={classNames('switched', productSwitching ? 'switching' : 'switchings')}
          onClick={() => tabbarSwitching(false)}
        >
          商品分类
        </Text>
      </View>

      {productSwitching && wgts.length > 0 ? (
        <WgtsContext.Provider
          value={{
            onAddToCart
          }}
        >
          <HomeWgts wgts={filterWgts} dtid={distributorId} onLoad={fetchLikeList}>
            {/* 猜你喜欢 */}
            <SpRecommend className='recommend-block' info={likeList} />
          </HomeWgts>
        </WgtsContext.Provider>
      ) : (
        <Categorys addPurchases={addPurchases} dtid={distributorId} />
      )}

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

      {/* 购物车弹框 */}
      <CompAddCart
        open={open}
        onMaskCloses={() =>
          setState((draft) => {
            draft.open = false
          })
        }
        parameter={parameter}
      />

      <SpLogin ref={loginRef} />
    </SpPage>
  )
}

export default StoreIndex
