import React, { useRef, useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { AtDrawer, AtTabs, AtSearchBar, AtInput } from 'taro-ui'
import {
  SpFilterBar,
  SearchBar,
  GoodsItem,
  SpTagBar,
  SpGoodsItem,
  SpSearchBar,
  SpNote,
  SpNavBar,
  SpLoadMore,
  TabBar,
  SpPage,
  SpScrollView,
  SpDrawer,
  SpSelect,
  SpPoint,
  SpImage
} from '@/components'
import doc from '@/doc'
import api from '@/api'
import {
  pickBy,
  classNames,
  isWeixin,
  getDistributorId,
  styleNames,
  VERSION_STANDARD
} from '@/utils'

import './list.scss'

const initialState = {
  leftList: [],
  rightList: [],
  brandList: [],
  pointSelect: [],
  filterList: [
    { title: '全部' },
    { title: '销量' },
    { title: '积分', icon: ['icon-shengxu-01', 'icon-jiangxu-01'], sort: 1 }
  ],
  curFilterIdx: 0,
  sort: -1,
  tagList: [],
  curTagIdx: 0,
  show: false,
  point: 0,
  isFocus: false,
  keywords: '',
  pointFilter: false,
  pointScoreList: [],
  start_price: '',
  end_price: ''
}

function PointShopList() {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const {
    leftList,
    rightList,
    brandList,
    pointSelect,
    curFilterIdx,
    sort,
    filterList,
    tagList,
    curTagIdx,
    show,
    point,
    isFocus,
    keywords,
    pointFilter,
    pointScoreList,
    start_price,
    end_price
  } = state

  const { userInfo } = useSelector((state) => state.user)
  const goodsRef = useRef()

  useEffect(() => {
    getInitConfig()
  }, [])

  useEffect(() => {
    if (leftList.length == 0) {
      goodsRef.current.reset()
    }
  }, [leftList])

  const getInitConfig = async () => {
    const [{ point: _point }, { screen }] = await Promise.all([
      api.pointitem.getMypoint(),
      api.pointitem.getPointitemSetting()
    ])
    const { point_openstatus, point_section } = screen
    setState((draft) => {
      draft.point = _point
      draft.pointFilter = point_openstatus
      draft.pointScoreList = point_section.map((item, index) => {
        return {
          id: index,
          name: `${item[0]}~${item[1]}`,
          value: item
        }
      })
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    const { dis_id, cat_id, main_cat_id } = $instance.router.params
    let params = {
      page: pageIndex,
      pageSize,
      item_type: 'normal',
      keywords
      // approve_status: 'onsale,only_show',
      // item_type: 'normal',
      // is_point: 'false'
    }
    if (pointSelect.length > 0) {
      const [idx] = pointSelect
      params.start_price = pointScoreList[idx].value[0]
      params.end_price = pointScoreList[idx].value[1]
    } else if (start_price && end_price) {
      params.start_price = start_price
      params.end_price = end_price
    }

    if (curFilterIdx == 1) {
      // 销量
      params['goodsSort'] = 1
    } else if (curFilterIdx == 2) {
      // 价格升序
      if (sort == 1) {
        params['goodsSort'] = 3
      } else {
        params['goodsSort'] = 2
      }
    }

    if (cat_id) {
      params['category'] = cat_id
    }

    if (main_cat_id) {
      params['main_category'] = main_cat_id
    }

    if (VERSION_STANDARD) {
      params.distributor_id = getDistributorId()
    }

    const {
      list,
      total_count,
      item_params_list = [],
      brand_list
    } = await api.pointitem.search(params)
    const n_list = pickBy(list, doc.goods.ITEM_LIST_POINT_GOODS)
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

    setState((draft) => {
      draft.leftList[pageIndex - 1] = resLeftList
      draft.rightList[pageIndex - 1] = resRightList
      draft.brandList = pickBy(brand_list?.list, doc.goods.WGT_GOODS_BRAND)
    })

    return { total: total_count }
  }

  const handleChangeSearch = (e) => {
    setState((draft) => {
      draft.keywords = e
    })
  }

  const handleConfirm = async (e) => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
    })
    console.log('handleConfirm:', leftList, rightList, keywords)
    // goodsRef.current.reset()
  }

  const handleFilterChange = ({ current, sort }) => {
    setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curFilterIdx = current || 0
      draft.sort = sort
    })
  }

  const onChangeFilterPoint = (val) => {
    setState((draft) => {
      draft.pointSelect = val
    })
  }

  const onConfirmFilter = async () => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.show = false
    })
    // goodsRef.current.reset()
  }

  const onResetFilter = async () => {
    await setState((draft) => {
      draft.pointSelect = []
      draft.leftList = []
      draft.rightList = []
      draft.start_price = ''
      draft.end_price = ''
      draft.show = false
    })
    // goodsRef.current.reset()
  }

  const handleClickStore = (item) => {
    const url = `/subpages/store/index?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  }
  return (
    <SpPage scrollToTopBtn className={classNames('page-pointshop-list')}>
      <View className='page-hd'>
        <View className='pointshop-hd'>
          <View className='point-info'>
            <View className='point-info-hd'>
              <SpImage src={userInfo?.avatar || 'user_icon.png'} width={80} height={80} />
              <Text className='user-name'>{userInfo?.username}</Text>
            </View>
            <View className='point-total'>
              <SpPoint value={point} />
            </View>
          </View>
        </View>
        <View className={classNames('item-list-head', { 'is-focus': isFocus })}>
          <SpFilterBar
            custom
            current={curFilterIdx}
            list={filterList}
            onChange={handleFilterChange}
          >
            {/* <View
              className='filter-btn'
              onClick={() => {
                setState((v) => {
                  v.show = true
                })
              }}
            >
              筛选<Text className='iconfont icon-filter'></Text>
            </View> */}

            <View className='search'>
              <View className='iconfont icon-sousuo-01'></View>
              <AtInput
                value={keywords}
                name='keywords'
                placeholder='搜索'
                onFocus={() => {
                  setState((draft) => {
                    draft.isFocus = true
                  })
                }}
                onBlur={() => {
                  setState((draft) => {
                    draft.isFocus = false
                  })
                }}
                onChange={handleChangeSearch.bind(this)}
                onConfirm={handleConfirm.bind(this)}
              />
            </View>
          </SpFilterBar>
        </View>
      </View>
      <SpScrollView className='item-list-scroll' auto={false} ref={goodsRef} fetch={fetch}>
        <View className='goods-list'>
          <View className='left-container'>
            {leftList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className='goods-item-wrap' key={`goods-item-l__${idx}_${sidx}`}>
                  <SpGoodsItem onStoreClick={handleClickStore} info={item} />
                </View>
              ))
            })}
          </View>
          <View className='right-container'>
            {rightList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className='goods-item-wrap' key={`goods-item-r__${idx}_${sidx}`}>
                  <SpGoodsItem onStoreClick={handleClickStore} info={item} />
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
        onConfirm={onConfirmFilter}
        onReset={onResetFilter}
      >
        <View className='fitler-title'>积分区间</View>
        <View className='custom-point-input'>
          <AtInput
            clear
            focus
            name='start_price'
            value={start_price}
            placeholder='最低积分'
            onChange={(e) => {
              setState((draft) => {
                draft.start_price = e
              })
            }}
          ></AtInput>
          <Text className='gap-line'>~</Text>
          <AtInput
            clear
            focus
            name='end_price'
            value={end_price}
            placeholder='最高积分'
            onChange={(e) => {
              setState((draft) => {
                draft.end_price = e
              })
            }}
          ></AtInput>
        </View>
        <SpSelect info={pointScoreList} value={pointSelect} onChange={onChangeFilterPoint} />
      </SpDrawer>
    </SpPage>
  )
}

export default PointShopList
