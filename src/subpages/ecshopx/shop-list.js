import Taro from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtDrawer, AtSearchBar } from 'taro-ui'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import {
  SpNewInput,
  SpSearch,
  SpFilterBar,
  SpShopItem,
  SpNewFilterDrawer,
  SpSearchBar,
  SpPage,
  SpScrollView,
  SpButton,
  SpTagBar,
  SpDrawer,
  SpSelect,
  SearchBar
} from '@/components'
import doc from '@/doc'
import { classNames, pickBy } from '@/utils'
import api from '@/api'
import './shop-list.scss'
import { Tracker } from '@/service'
//plusValue 代表正序 minusValue代表倒序
const TIME_SORT = 0
const SALE_PLUS_SORT = 4
const SALE_MINUS_SORT = 3
const DISTANCE_PLUS_SORT = 1
const DISTANCE_MINUS_SORT = 2
const DEFAULT_SORT_VALUE = DISTANCE_PLUS_SORT

const FILTER_DATA = [
  { value: TIME_SORT, tag_name: '综合排序' },
  { tag_name: '销量', plusValue: SALE_PLUS_SORT, minusValue: SALE_MINUS_SORT },
  { tag_name: '距离', plusValue: DISTANCE_PLUS_SORT, minusValue: DISTANCE_MINUS_SORT }
]
const BUSINESS_LIST_SERVICES = [
  { id: 'ziti', name: '自提' },
  { id: 'delivery', name: '快递' },
  { id: 'dada', name: '同城配' }
]

const initialState = {
  curFilterIdx: DEFAULT_SORT_VALUE,
  name: '',
  list: [],
  tagList: [],
  brandSelect: [],
  businessServices: [],
  plus: true
}

function shopList (props) {
  const [state, setState] = useImmer(initialState)
  const { brandSelect, businessServices, name, curFilterIdx, plus } = state
  const goodsRef = useRef()
  useEffect(() => {}, [])
  const [drawer, setDrawer] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { location } = useSelector((state) => state.user)
  const fetch = async (params) => {
    const { pageIndex: page, pageSize } = params
    const query = {
      page,
      pageSize,
      province: location.lat ? location.province : '北京市',
      city: location.lat ? location.city : '北京市',
      area: location.lat ? location.district : '昌平区',
      type: 0,
      show_discount: 1,
      show_marketing_activity: 1,
      is_ziti: businessServices.includes('ziti') ? 1 : undefined,
      is_delivery: businessServices.includes('delivery') ? 1 : undefined,
      is_dada: businessServices.includes('dada') ? 1 : undefined,
      distributor_tag_id: brandSelect.join(),
      lng: location.lng,
      lat: location.lat,
      //是否展示积分
      show_score: 1,
      sort_type: curFilterIdx,
      show_items: 1,
      name
    }
    const { list, total_count, tagList } = await api.shop.list(query)
    const _list = pickBy(list, doc.shop.SHOP_ITEM)
    const _tagList = pickBy(tagList, doc.goods.BUSINESS_LIST_TAG)

    await setState((v) => {
      v.list = [...v.list, ..._list]
      v.tagList = _tagList
    })

    return {
      total: total_count
    }
    // setDataList([...dataList, ...list]);
    // setTotal(total_count);
    // fillFilterTag(tagList);
  }

  const isChecked = (item) => {
    return (
      item.value === curFilterIdx ||
      item.plusValue === curFilterIdx ||
      item.minusValue === curFilterIdx
    )
  }

  const handleFilterChange = useCallback(
    async (index, item) => {
      const sortFunc = (s_item) => {
        if (s_item.value || s_item.value == 0) {
          checked = s_item.value
        } else {
          if (plus) {
            checked = s_item.minusValue
          } else {
            checked = s_item.plusValue
          }
        }
      }
      let checked = 0
      //如果是选中的
      if (isChecked(item)) {
        sortFunc(item)
      } else {
        sortFunc(item)
      }
      await setState((v) => {
        v.plus = !plus
      })
      const lastDistanceFilter =
        curFilterIdx == DISTANCE_PLUS_SORT || curFilterIdx == DISTANCE_MINUS_SORT
      const distanceFilter = checked == DISTANCE_PLUS_SORT || checked == DISTANCE_MINUS_SORT
      await setState((draft) => {
        draft.list = []
      })
      //如果从非距离tab切换回来距离tab  应该是由近到远
      if (!lastDistanceFilter && distanceFilter) {
        await setState((draft) => {
          draft.curFilterIdx = DEFAULT_SORT_VALUE
        })
        goodsRef.current.reset()
        return
      }
      await setState((draft) => {
        draft.curFilterIdx = checked
      })
      goodsRef.current.reset()
    },
    [curFilterIdx]
  )

  const handleOnFocus = () => {
    setIsShowSearch(true)
  }

  const handleOnChange = (val) => {
    setState((v) => {
      v.name = val
    })
  }

  const handleOnClear = async () => {
    await setState((v) => {
      v.name = ''
      v.list = []
    })
    setIsShowSearch(false)
    goodsRef.current.reset()
  }

  const handleSearchOff = () => {
    setState((v) => {
      v.name = ''
    })
    setIsShowSearch(false)
  }

  const handleConfirm = async (val) => {
    Tracker.dispatch('SEARCH_RESULT', {
      name: val
    })
    setIsShowSearch(false)
    await setState((v) => {
      v.list = []
      v.name = val
    })
    goodsRef.current.reset()
  }

  const { list, tagList } = state
  const onConfirmBrand = async () => {
    setDrawer(false)
    await setState((v) => {
      v.list = []
    })
    goodsRef.current.reset()
  }

  const onResetBrand = async () => {
    await setState((draft) => {
      draft.brandSelect = []
      draft.businessServices = []
      draft.list = []
    })
    setDrawer(false)
    goodsRef.current.reset()
  }

  const onChangeBrand = async (val) => {
    await setState((draft) => {
      draft.brandSelect = val
    })
  }

  const onChangeBusinessServices = async (val) => {
    await setState((draft) => {
      draft.businessServices = val
    })
  }

  const handleClickItem = (item) => {
    Taro.navigateTo({ url: `/pages/store/index?id=${item.distributor_id}` })
  }

  return (
    <SpPage className='page-shop-list'>
      <View className='search-block'>
        <SpSearchBar
          keyword={name}
          placeholder='请输入商家、商品'
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleSearchOff}
          onConfirm={handleConfirm}
        />
      </View>
      <View className='filter-block'>
        <SpTagBar
          className='tag-list'
          list={FILTER_DATA}
          value={curFilterIdx}
          onChange={handleFilterChange}
        >
          <View
            className='filter-btn'
            onClick={() => {
              setDrawer(true)
            }}
          >
            筛选<Text className='iconfont icon-filter'></Text>
          </View>
        </SpTagBar>
      </View>
      <SpScrollView className='shoplist-block' fetch={fetch} ref={goodsRef}>
        {list.map((item, index) => (
          <View className='shop-item-wrapper' key={`shopitem-wrap__${index}`}>
            <SpShopItem
              info={item}
              jumpToBusiness={() => handleClickItem(item)}
              showGoods={name}
              key={`shopitem-wrap__${index.toString()}`}
            />
            <View className='inline-block'/>
          </View>
        ))}
      </SpScrollView>
      <SpDrawer
        show={drawer}
        onClose={() => {
          setDrawer(false)
        }}
        onConfirm={onConfirmBrand}
        onReset={onResetBrand}
      >
        <View className='brand-title'>商家类型</View>
        <SpSelect multiple info={tagList} value={brandSelect} onChange={onChangeBrand} />
        <View className='brand-title'>商家服务</View>
        <SpSelect
          multiple
          info={BUSINESS_LIST_SERVICES}
          value={businessServices}
          onChange={onChangeBusinessServices}
        />
      </SpDrawer>
    </SpPage>
  )
}

export default shopList
