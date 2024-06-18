import Taro, { getCurrentInstance, useRouter, useDidShow } from '@tarojs/taro'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, pickBy, showToast } from '@/utils'
import { SpImage, SpPage, SpTabs, SpSearchInput, SpNavFilter, SpScrollView } from '@/components'
import CompFilterBar from './comps/comp-filter-bar'
import { platformTemplateName } from '@/utils/platform'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompPurchasingList from './comps/comp-purchasing-list'
import CompCar from './comps/comp-car'
import './purchasing.scss'

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
  querys:null
}

const Purchasing = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { codeStatus, navFilterList, tag_id, category, status, lists, first,querys } = state
  const { params } = useRouter()
  const goodsRef = useRef()

  useEffect(() => {
    setState((draft) => {
      draft.lists = []
    })
    goodsRef.current.reset()
  }, [querys])

  useDidShow(() => {
    setState((draft) => {
      draft.lists = []
    })
    goodsRef.current.reset()
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    const query = {
      page: pageIndex,
      pageSize,
      isSalesmanPage: 1,
      item_type: 'normal',
      approve_status: 'onsale,only_show',
      is_promoter: true,
      // distributor_id: params.distributor_id,
      ...querys
    }
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
      price: ({ price }) => (price / 100).toFixed(2),
      promoter_price: ({ promoter_price }) => (promoter_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      commission_type: 'commission_type',
      promoter_point: 'promoter_point'
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
    {console.log(params,'paramspppp-------')}
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
      draft.querys = {...querys,...params}
    })
  }

  return (
    <SpPage className={classNames('page-selectShop')} renderFooter={<CompCar />}>
      <SpSearchInput
        placeholder='输入内容'
        onConfirm={(val) => {
          console.log(666, val)
        }}
        onSelectArea={(val) => {
          console.log('666area', val)
        }}
      />
      <SpNavFilter info={navFilterList} onChange={handleFilterChange} />

      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        {lists.map((item, index) => {
          return <CompPurchasingList items={item} key={index} />
        })}
      </SpScrollView>
    </SpPage>
  )
}

export default Purchasing
