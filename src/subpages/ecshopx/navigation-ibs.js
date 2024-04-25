import React, { useEffect, useRef } from 'react'
import Taro, { useShareAppMessage, useShareTimeline, useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpPage, SpSearch, SpRecommend, SpSkuSelect } from '@/components'
import api from '@/api'
import {
  isWeixin,
  isEmpty,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  classNames,
  getCurrentPageRouteParams,
  resolveStringifyParams,
  pickBy,
  showToast
} from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateLocation } from '@/store/slices/user'
import { platformTemplateName } from '@/utils/platform'
import { updateShopInfo } from '@/store/slices/shop'
import { useImmer } from 'use-immer'
import { useNavigation } from '@/hooks'
import doc from '@/doc'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { WgtHomeHeader } from '@/pages/home/wgts'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import NavigationClassification from './comps/comp-navigation-classification'
import { parse } from 'qs'

import './navigation-ibs.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
  wgts: [],
  showBackToTop: false,
  loading: true,
  searchComp: null,
  pageData: null,
  fixedTop: false,
  filterWgts: [],
  isShowHomeHeader: false,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker',
  seletedTags: [],
  classifyList: null
}

function NavigationIbs() {
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const pageRef = useRef()
  const router = useRouter()
  const { initState, openRecommend, openLocation, openStore, openScanQrcode } = useSelector(
    (state) => state.sys
  )
  // const { shopInfo } = useSelector((state) => state.shop)

  // const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { setNavigationBarTitle } = useNavigation()

  const {
    loading,
    searchComp,
    pageData,
    fixedTop,
    filterWgts,
    isShowHomeHeader,
    info,
    skuPanelOpen,
    selectType,
    seletedTags,
    classifyList
  } = state

  const dispatch = useDispatch()

  //请求销售分类数据请求接口和设置动态的标题
  useEffect(() => {
    let { content, seletedTags } = router.params
    setState((draft) => {
      draft.seletedTags = parse(decodeURIComponent(seletedTags))
    })
    goodsCategoryin()
    setNavigationBarTitle(content)
  }, [])

  //非云店和地址存在请求挂件接口
  useEffect(() => {
    if (location && VERSION_STANDARD) {
      fetchWgts()
    }
  }, [location])

  //弹窗出来时固定页面
  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  //基于存在销售分类数据请求接口
  useEffect(() => {
    if (classifyList) {
      init()
    }
  }, [classifyList])

  //获销售分类数据，并且处理成页面需要的数据
  const goodsCategoryin = async () => {
    let tags = parse(decodeURIComponent(router.params.seletedTags))
    let res = await api.item.goodsCategoryinfo({ category_id: router.params.id })
    //挂件中存在商家第一层加推荐店铺
    if (Object.values(tags).length > 0) {
      res.children.unshift({
        category_name: '推荐店铺',
        image_url:true,
      })
    }
    //第二层默认是全部，并且那第一层的category_id
    res.children.forEach((element) => {
      element?.children?.unshift({
        category_name: '全部',
        category_id: element.category_id
      })
    })
    setState((draft) => {
      draft.classifyList = res
    })
  }

  // useShareAppMessage(async (res) => {
  //   const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
  //   let params = getCurrentPageRouteParams()
  //   const dtid = getDistributorId()
  //   if (dtid && !('dtid' in params)) {
  //     params = Object.assign(params, { dtid })
  //   }
  //   let path = `/pages/index${isEmpty(params) ? '' : '?' + resolveStringifyParams(params)}`

  //   console.log('useShareAppMessage path:', path, params)

  //   return {
  //     title: title,
  //     imageUrl: imageUrl,
  //     path
  //   }
  // })

  // useShareTimeline(async (res) => {
  //   const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
  //   let params = getCurrentPageRouteParams()
  //   const dtid = getDistributorId()

  //   if (dtid && !('dtid' in params)) {
  //     params = Object.assign(params, { dtid })
  //   }

  //   console.log('useShareTimeline params:', params)
  //   return {
  //     title: title,
  //     imageUrl: imageUrl,
  //     query: resolveStringifyParams(params)
  //   }
  // })

  const init = async () => {
    fetchLocation()
    // 非云店
    if (!VERSION_STANDARD) {
      fetchWgts()
    } else {
      fetchStoreInfo(location)
    }
  }

  /**
   * 获取模版装修数据
   */
  const fetchWgts = async () => {
    setState((draft) => {
      draft.wgts = []
      draft.pageData = []
      draft.filterWgts = []
      draft.loading = true
    })
    const query = {
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: `custom_${classifyList.customize_page_id}`
    }
    const { config } = await api.category.getCategory(query)
    const searchComps = config.find((wgt) => wgt.name == 'search')
    const pageDatas = config.find((wgt) => wgt.name == 'page')
    let filWgts = []
    if (searchComps && searchComps.config.fixTop) {
      filWgts = config.filter((wgt) => wgt.name !== 'search' && wgt.name != 'page')
    } else {
      filWgts = config.filter((wgt) => wgt.name != 'page')
    }

    const fixedTops = searchComps && searchComps.config.fixTop
    const isShowHomeHeaders =
      VERSION_PLATFORM ||
      (openScanQrcode == 1 && isWeixin) ||
      (VERSION_STANDARD && openStore && openLocation == 1) ||
      fixedTops

    setState((draft) => {
      draft.wgts = config
      draft.searchComp = searchComps
      draft.pageData = pageDatas
      draft.fixedTop = fixedTops
      draft.isShowHomeHeader = isShowHomeHeaders
      draft.filterWgts = filWgts
      draft.loading = false
    })
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

  //判断是否开启定位，通过定位获取数据
  const fetchLocation = () => {
    if (!location && ((VERSION_STANDARD && openLocation == 1) || VERSION_PLATFORM)) {
      try {
        entryLaunch.isOpenPosition((res) => {
          if (res.lat) {
            dispatch(updateLocation(res))
          }
        })
      } catch (e) {
        console.error('map location fail:', e)
      }
    }
  }

  //云店获取数据，并且存在redux中
  const fetchStoreInfo = async (locations) => {
    let params = {
      distributor_id: getDistributorId() // 如果店铺id和经纬度都传会根据哪个去定位传参
    }
    if (openLocation == 1 && locations) {
      const { lat, lng } = locations
      params.lat = lat
      params.lng = lng
      // params.distributor_id = undefined
    }
    const res = await api.shop.getShop(params)
    console.log('fetchStoreInfo:', res)
    dispatch(updateShopInfo(res))
  }

  // 加购
  const onAddToCart = async ({ itemId, distributorId }) => {
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
      showToast(e.message)
      Taro.hideLoading()
    }
  }

  return (
    <SpPage
      className='page-navigation-ibs'
      scrollToTopBtn
      pageConfig={pageData?.base}
      loading={loading}
      ref={pageRef}
    >
      {/* 定位 */}
      <View
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
      >
        {console.log('searchComp:', searchComp, location)}
        {isShowHomeHeader && (
          <WgtHomeHeader className='home-header-ibs' jump={1 == 2}>
            {fixedTop && <SpSearch info={searchComp} />}
          </WgtHomeHeader>
        )}
        {/* 模版装修 */}
        {filterWgts.length > 0 && (
          <WgtsContext.Provider
            value={{
              onAddToCart
            }}
          >
            <HomeWgts wgts={filterWgts} onLoad={fetchLikeList} copywriting={false}>
              <SpRecommend className='recommend-block' info={likeList} />
            </HomeWgts>
          </WgtsContext.Provider>
        )}
        {/* 定位获取数据页面    onAddToCart加购   classifyList销售分类数据   seletedTags商家 */}
        <NavigationClassification
          seletedTags={seletedTags}
          classifyList={classifyList}
          onAddToCart={onAddToCart}
        />
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
    </SpPage>
  )
}

export default NavigationIbs
