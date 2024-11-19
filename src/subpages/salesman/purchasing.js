import Taro, { getCurrentInstance, useRouter, useDidShow } from '@tarojs/taro'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, pickBy, showToast } from '@/utils'
import {
  SpImage,
  SpPage,
  SpTabs,
  SpSearchInput,
  SpNavFilter,
  SpSkuSelect,
  SpScrollView
} from '@/components'
import { updateSalesmanCount,updateShopSalesmanCartCount } from '@/store/slices/cart'
import CompFilterBar from './comps/comp-filter-bar'
import { platformTemplateName } from '@/utils/platform'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import doc from '@/doc'
import CompPurchasingList from './comps/comp-purchasing-list'
import CompCar from './comps/comp-car'
import './purchasing.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initialConfigState = {
  codeStatus: false,
  navFilterList: [
    {
      key: 'tag_id',
      name: '标签',
      label: '标签',
      activeIndex: null,
      option: []
    },
    {
      key: 'category',
      name: '分类',
      label: '分类',
      activeIndex: null,
      option: [
        { category_name: '全部', category_id: 'all' }
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
      label: '状态',
      name: '状态',
      activeIndex: null,
      option: [
        { label: '有货', value: 1 },
        { label: '无货', value: 0 }
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
  searchConditionList: [
    { label: '商品名称', value: 'title' },
    { label: '货号', value: 'item_bn' }
  ],
  parameter: {}
}

const Purchasing = () => {
  const [state, setState] = useImmer(initialConfigState)
  const {
    skuPanelOpen,
    info,
    selectType,
    searchConditionList,
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

  const carNumber =async () =>{
    Taro.setStorageSync('distributorSalesman', { distributor_id: params.distributor_id } )
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
    await dispatch(updateShopSalesmanCartCount(shopCats))  //更新购物车价格
    
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
      pics: ({ pics }) => pics[0],
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
          placeholder='输入内容'
          onConfirm={(val) => {
            onConfirms(val)
          }}
        />
        <SpNavFilter info={navFilterList} onChange={handleFilterChange} />
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
