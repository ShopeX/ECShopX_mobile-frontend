import React, { useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpPage, SpSearch, SpRecommend, SpSkuSelect } from '@/components'
import api from '@/api'
import {
  isWeixin,
  VERSION_PLATFORM,
  classNames,
  pickBy,
  showToast
} from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateLocation } from '@/store/slices/user'
import { platformTemplateName } from '@/utils/platform'
import { useImmer } from 'use-immer'
import { useNavigation } from '@/hooks'
import doc from '@/doc'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { WgtHomeHeader } from '@/pages/home/wgts'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import CompNavigationClassification from './comps/comp-navigation-classification'
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
  classifyList: null,
  jump:false
}

function NavigationIbs() {
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const pageRef = useRef()
  const router = useRouter()
  const { openRecommend } = useSelector(
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
    classifyList,
    jump
  } = state

  const dispatch = useDispatch()

  //请求销售分类数据请求接口和设置动态的标题
  useEffect(() => {
    let { content, seletedTags } = router.params
    setState((draft) => {
      draft.seletedTags = Object.values(parse(decodeURIComponent(seletedTags)))
    })
    goodsCategoryin()
    setNavigationBarTitle(content)
  }, [])

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
    if (!location) {
      fetchLocation()
    }
  }, [])

  //获销售分类数据，并且处理成页面需要的数据
  const goodsCategoryin = async () => {
    let tags = parse(decodeURIComponent(router.params.seletedTags))
    let res = await api.item.goodsCategoryinfo({ category_id: router.params.id })
    fetchWgts(res.customize_page_id)
    //挂件中存在商家第一层加推荐店铺
    if (Object.values(tags).length > 0) {
      res.children.unshift({
        category_name: '推荐店铺',
        category_ids: 0,
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


  /**
   * 获取模版装修数据
   */
  const fetchWgts = async (id) => {
    setState((draft) => {
      draft.wgts = []
      draft.pageData = []
      draft.filterWgts = []
      draft.loading = true
    })
    const query = {
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: `custom_${id}`
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
      VERSION_PLATFORM || fixedTops

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


  //判断是否开启定位，通过定位获取数据（平台）
  const fetchLocation = () => {
    if (VERSION_PLATFORM) {
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
        {isShowHomeHeader && (
          <WgtHomeHeader className='home-header-ibs' jump={jump}>
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
            <HomeWgts wgts={filterWgts} copywriting={false}>
              <SpRecommend className='recommend-block' info={likeList} />
            </HomeWgts>
          </WgtsContext.Provider>
        )}
        {/* onAddToCart加购   classifyList销售分类数据   seletedTags商家 */}
        <CompNavigationClassification
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
