import React, { useEffect, useState, useRef, useCallback } from 'react'
import Taro, { useShareAppMessage, useShareTimeline, useDidShow,getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpFloatMenuItem, SpPage, SpSearch, SpRecommend, SpTabbar ,SpSkuSelect} from '@/components'
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
  log
} from '@/utils'
import { useImmer } from 'use-immer'
import { useNavigation } from '@/hooks'
import qs from 'qs'
import HomeWgts from '@/pages/home/comps/home-wgts'
import CompTabbar from './comps/comp-tabbar'
import CompShopBrand from './comps/comp-shopbrand'
import Categorys from './categorys'
import CompTab from './comps/comp-tab'
import { updateShopCartCount } from '@/store/slices/cart'


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
}

function StoreIndex() {
  const [state, setState] = useImmer(initState)
  const [likeList, setLikeList] = useImmer([])
  const { openRecommend, openLocation, openStore } = useSelector((state) => state.sys)
  const {shopCartCount} = useSelector((state) => state.cart)
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
    selectType
  } = state

  const dispatch = useDispatch()
  const pageRef = useRef()

  useEffect(() => {
    fetchWgts()
    
  }, [])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  const fetchWgts = async () => {
    const { id, dtid } = await entryLaunch.getRouteParams()
    const distributor_id = getDistributorId(id || dtid)
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
    let params ={
      distributor_id,
      shop_type: 'distributor'
    }
    const {valid_cart} = await api.cart.get(params)
      let shopCats= {
        shop_id:valid_cart[0]?.shop_id || "",  //下单
        cart_total_num:valid_cart[0]?.cart_total_num || "",   //数量
        total_fee:valid_cart[0]?.total_fee || "",   //实付金额
        discount_fee:valid_cart[0]?.discount_fee || "",   //优惠金额
        storeDetails:valid_cart[0] || {}
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
    const { dtid } = await entryLaunch.getRouteParams()
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
    const data = await entryLaunch.getRouteParams()
    const dtid = data.id || data.dtid
    const query = {
      dtid
    }
    const path = `/subpages/store/index?${qs.stringify(query)}`
    log.debug(`share path: ${path}`)
    return {
      title: storeInfo?.name,
      imageUrl: storeInfo?.logo,
      path
    }
  }


  const settlement = () =>{
    const { type = 'distributor' } = router.params
    const { shop_id, is_delivery, is_ziti, shop_name, address, lat, lng, hour, mobile } = shopCartCount.storeDetails
    const query = {
      cart_type: 'cart',
      type,
      shop_id,
      is_delivery,
      is_ziti,
      name: shop_name,
      store_address: address,
      lat,
      lng,
      hour,
      phone: mobile,
      //购物车默认是0     0:普通商品  1:跨境商品
      // goodType: current == 0 ? 'normal' : 'cross'
      goodType:'normal'
    }
    Taro.navigateTo({
      url: `/pages/cart/espier-checkout?${qs.stringify(query)}`
    })
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
      renderFooter={<CompTab settlement={settlement} />}
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

      <View className='switchs'>
        <Text
          className={classNames(productSwitching ? null : 'switching')}
          onClick={() => tabbarSwitching(true)}
        >
          首页
        </Text>
        <Text
          className={classNames('switched', productSwitching ? 'switching' : null)}
          onClick={() => tabbarSwitching(false)}
        >
          全部商品
        </Text>
      </View>

      {productSwitching && wgts.length > 0 ? (
        <HomeWgts wgts={filterWgts} dtid={distributorId} onLoad={fetchLikeList}>
          {/* 猜你喜欢 */}
          <SpRecommend className='recommend-block' info={likeList} />
        </HomeWgts>
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
    </SpPage>
  )
}

export default StoreIndex
