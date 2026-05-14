/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import React, { useEffect, useMemo, useRef } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, pickBy, showToast } from '@/utils'
import { SpImage, SpPage, SpTabs, SpSearchInput, SpSkuSelect, SpScrollView } from '@/components'
import { SpNavFilter } from '@/subpages/components'
import { updateSalesmanCount, updateShopSalesmanCartCount } from '@/store/slices/cart'
import { platformTemplateName } from '@/utils/platform'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import doc from '@/doc'
import { $t, useTranslation } from '@/i18n'
import CompPurchasingList from './comps/comp-purchasing-list'
import CompCar from './comps/comp-car'
import './purchasing.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initialConfigState = {
  codeStatus: false,
  navFilterList: [
    {
      key: 'tag_id',
      name: '',
      label: '',
      activeIndex: null,
      option: []
    },
    {
      key: 'category',
      name: '',
      label: '',
      activeIndex: null,
      option: [
        { category_name: '', category_id: 'all' }
        // {
        //   category_name: '男装',
        //   category_id: '1',
        //   children: [
        //     {
        //       category_name: '上衣',
        //       category_id: '3',
        //       children: [{ category_name: '卫衣', category_id: '4' }]
        //     }
        //   ]
        // },
        // { category_name: '女装', category_id: '2' }
      ]
    },
    {
      key: 'store_status',
      label: '',
      name: '',
      activeIndex: null,
      option: [
        { label: '', value: 1 },
        { label: '', value: 0 }
      ]
    }
  ],
  tag_id: '',
  category: '',
  status: '',
  lists: [],
  first: true,
  querys: null,
  skuPanelOpen: false,
  info: null,
  selectType: 'picker',
  parameter: {}
}

const Purchasing = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const {
    skuPanelOpen,
    info,
    selectType,
    parameter,
    codeStatus,
    navFilterList,
    tag_id,
    category,
    status,
    lists,
    first,
    querys
  } = state
  const dispatch = useDispatch()
  const { customerLnformation } = useSelector((state) => state.cart)
  const { params } = useRouter()
  const goodsRef = useRef()
  const pageRef = useRef()

  const searchConditionList = useMemo(
    () => [
      { label: $t('7456dcd3.1fd1d5'), value: 'title' },
      { label: $t('7456dcd3.9b979b'), value: 'item_bn' }
    ],
    [i18n.language]
  )

  const navFilterListForView = useMemo(() => {
    if (!navFilterList?.length) return navFilterList
    return navFilterList.map((nav) => {
      if (nav.key === 'tag_id') {
        return { ...nav, name: $t('f1d3181c.14d342'), label: $t('f1d3181c.14d342') }
      }
      if (nav.key === 'category') {
        const option = (nav.option || []).map((o, j) =>
          j === 0 && o.category_id === 'all' ? { ...o, category_name: $t('f1d3181c.a8b0c2') } : o
        )
        return { ...nav, name: $t('f1d3181c.d0771a'), label: $t('f1d3181c.d0771a'), option }
      }
      if (nav.key === 'store_status' && nav.option?.length >= 2) {
        return {
          ...nav,
          name: $t('f1d3181c.3fea7c'),
          label: $t('f1d3181c.3fea7c'),
          option: [
            { ...nav.option[0], label: $t('f1d3181c.72c0c7') },
            { ...nav.option[1], label: $t('f1d3181c.7cfe76') }
          ]
        }
      }
      return nav
    })
  }, [navFilterList, i18n.language])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('99704808.dc04fa') })
  }, [i18n.language])

  useEffect(() => {
    setState((draft) => {
      draft.lists = []
    })
    goodsRef.current.reset()
  }, [querys, parameter])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  useDidShow(() => {
    carNumber()
    setState((draft) => {
      draft.lists = []
    })
    goodsRef.current.reset()
  })

  const carNumber = async () => {
    Taro.setStorageSync('distributorSalesman', { distributor_id: params.distributor_id })
    let data = {
      shop_type: 'distributor',
      ...customerLnformation,
      distributor_id: params.distributor_id
    }
    await dispatch(updateSalesmanCount(data)) //更新购物车数量
    const { valid_cart } = await api.cart.get(data)
    let shopCats = {
      shop_id: valid_cart[0]?.shop_id || '', //下单
      cart_total_num: valid_cart[0]?.cart_total_num || '', //数量
      total_fee: valid_cart[0]?.total_fee || '', //实付金额
      discount_fee: valid_cart[0]?.discount_fee || '', //优惠金额
      storeDetails: valid_cart[0] || {}
    }
    await dispatch(updateShopSalesmanCartCount(shopCats)) //更新购物车价格
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    const query = {
      page: pageIndex,
      pageSize,
      isSalesmanPage: 1,
      item_type: 'normal',
      approve_status: 'onsale,only_show',
      is_promoter: true,
      distributor_id: params.distributor_id,
      ...querys
    }
    query[parameter.key] = parameter.keywords

    const {
      list,
      total_count,
      item_params_list = [],
      select_tags_list
    } = await api.item.search(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      goods_id: 'goods_id',
      title: 'item_name',
      desc: 'brief',
      store: 'store',
      itemBn: 'itemBn',
      distributor_id: 'distributor_id',
      price: ({ price }) => (price / 100).toFixed(2),
      promoter_price: ({ promoter_price }) => (promoter_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      commission_type: 'commission_type',
      promoter_point: 'promoter_point',
      pics: ({ pics }) => pics[0]
    })

    setState((draft) => {
      draft.lists = [...lists, ...nList]
      draft.first = false
    })
    if (first) {
      await getCategory(select_tags_list)
    }

    return {
      total: total_count
    }
  }

  const getCategory = async (select_tags_list) => {
    const query = {
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: 'category',
      isSalesmanPage: 1,
      distributor_id: params.distributor_id
    }
    const seriesList = await api.salesman.get(query)
    let nav = JSON.parse(JSON.stringify(navFilterList))

    select_tags_list?.map((item) => {
      nav[0].option.push({
        label: item.tag_name,
        value: item.tag_id
      })
    })

    const classification = (item) => {
      item.forEach((l, i) => {
        l.category_name = l.category_name
        l.category_id = l.category_id
        if (l?.children) {
          classification(l.children)
        }
      })
      return item
    }

    let res = classification(seriesList)

    nav[1].option = [...nav[1].option, ...(res ?? [])]
    setState((draft) => {
      draft.navFilterList = nav
    })
  }

  // const handleFilterChange = useCallback(
  //   async (key, value) => {
  //     console.log(789, key, value)
  //     setState((v) => {
  //       v[key] = value
  //     })
  //   },
  //   [tag_id, category, status]
  // )

  const handleFilterChange = (key, value) => {
    console.log(789, key, value)
    let params = {}
    if (key == 'category') {
      params['category_id'] = value
    } else {
      params[key] = value
    }
    setState((draft) => {
      draft.querys = { ...querys, ...params }
    })
  }

  const addCart = async ({ distributor_id, item_id }) => {
    try {
      Taro.showLoading()
      const itemDetail = await api.item.detail(item_id, {
        showError: false,
        distributor_id
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

  const onConfirms = (val) => {
    setState((draft) => {
      draft.parameter = val
    })
  }

  return (
    <SpPage className={classNames('page-selectShop')} renderFooter={<CompCar />} ref={pageRef}>
      <View className='page-selectShop-header'>
        <SpSearchInput
          isShowSearchCondition
          searchConditionList={searchConditionList}
          placeholder={$t('9696edd5.ec47d2')}
          onConfirm={(val) => {
            onConfirms(val)
          }}
        />
        <SpNavFilter info={navFilterListForView} onChange={handleFilterChange} />
      </View>

      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        {lists.map((item, index) => {
          return <CompPurchasingList items={item} key={index} addCart={addCart} />
        })}
      </SpScrollView>

      {/* Sku选择器 */}
      <MSpSkuSelect
        open={skuPanelOpen}
        type={selectType}
        info={info}
        salesman
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

export default Purchasing
