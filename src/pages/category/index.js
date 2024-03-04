import React, { useRef, useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import Taro, { useDidShow, getCurrentInstance } from '@tarojs/taro'
import { Text, View,Image } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpScrollView, SpPage, SpTabbar, SpCategorySearch } from '@/components'
import api from '@/api'
// import { updateCount } from '@/store/slices/purchase'
import doc from '@/doc'
import { useDebounce } from '@/hooks'

import { pickBy, classNames, styleNames,showToast } from '@/utils'
import CompFirstCategory from './comps/comp-first-category'
import CompSecondCategory from './comps/comp-second-category'
import CompThirdCategory from './comps/comp-third-category'
import GoodsItem from './comps/goods-item'
import './index.scss' 

const initialState = {
  cusIndex: 1,
  keywords: '',
  allList: [],
  categoryFirstIndex: 0,
  categorySecondIndex: 0,
  categoryThirdIndex: 0,
  goodsSort: 0,
  seriesList: [],
  cat_id: undefined,
  show: false,
  secondList: [],
  thirdList: []
}

function StoreItemList(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  // const { purchase_share_info = {} } = useSelector((state) => state.purchase)
  const {
    keywords,
    cusIndex,
    allList,
    goodsSort,
    seriesList,
    categoryFirstIndex,
    categorySecondIndex,
    categoryThirdIndex,
    cat_id,
    secondList,
    thirdList
  } = state

  const goodsRef = useRef()
  const dispatch = useDispatch()
  useEffect(() => {
    getCategoryList()
  }, [])

  useEffect(() => {
    if (cat_id) {
      goodsRef?.current.reset()
      changeList()
    }
  }, [cat_id])

  const getCategoryList = async () => {
    // const { activity_id ,enterprise_id} = purchase_share_info
    const res = await api.category.get({activity_id:'12',enterprise_id:'12'})
    const currentList = pickBy(res, {
      name: 'category_name',
      img: 'image_url',
      id: 'category_id',
      category_id: 'category_id',
      children: ({ children }) =>
        pickBy(children, {
          name: 'category_name',
          img: 'image_url',
          id: 'category_id',
          category_id: 'category_id',
          children: ({ children: children_ }) =>
            pickBy(children_, {
              name: 'category_name',
              img: 'image_url',
              id: 'category_id'
            })
        })
    })
    setState((draft) => {
      draft.seriesList = currentList
      draft.hasSeries = true
      draft.cat_id = currentList[0].id
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    // const { activity_id,enterprise_id } = purchase_share_info
    const { dis_id = null } = $instance.router.params
    const params = {
      page: pageIndex,
      pageSize,
      // activity_id,
      // enterprise_id,
      keywords: keywords,
      approve_status: 'onsale,only_show',
      item_type: 'normal',
      is_point: 'false',
      distributor_id: dis_id || Taro.getStorageSync('distributor_id'),
      goodsSort,
      cat_id: cat_id,
      v_store: cusIndex
    }

    const { list: _list, total_count } = await api.purchase.getPurchaseActivityItems(params)
    
    let n_list = pickBy(_list, doc.goods.ITEM_LIST_GOODS)


    setState((draft) => {
      draft.allList = pageIndex == 1 ? n_list : [...allList, ...n_list]
    })

    return { total: total_count }
  }

  const handleClickStore = (item) => {
    const url = `/pages/indexStore?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  const handleConfirm = async (val) => {
    console.log('handleConfirm', val)
    if (val) {
      Taro.navigateTo({
        url: `/pages/item/list?keywords1=${val}`
      })
    }
  }

  const onFirstCategoryClick = useDebounce((index) => {
    if (categoryFirstIndex == index) return
    setState((draft) => {
      draft.categoryFirstIndex = index
      draft.categorySecondIndex = 0
      draft.categoryThirdIndex = 0
      draft.allList = []
      draft.cat_id = seriesList[index]?.id
    })
  }, 200)

  const onSecondCategoryClick = useDebounce((index) => {
    if (categorySecondIndex == index) return
    setState((draft) => {
      draft.categorySecondIndex = index
      draft.categoryThirdIndex = 0
      draft.allList = []
      draft.cat_id = index == 0 ? seriesList[categoryFirstIndex]?.id : secondList[index]?.id
    })
  }, 200)

  const onThirdCategoryClick = useDebounce((index) => {
    if (categoryThirdIndex == index) return
    setState((draft) => {
      draft.categoryThirdIndex = index
      draft.allList = []
      draft.cat_id = index == 0 ? secondList[categorySecondIndex]?.id : thirdList[index]?.id
    })
  }, 200)

  const onSelectClick = () => {
    setState((draft) => {
      draft.cusIndex = cusIndex === 1 ? 0 : 1
      draft.allList = []
    })
    goodsRef?.current.reset()
  }

  const shoppingCart = async (item,e)=>{
    // const { activity_id, enterprise_id,distributor_id } = purchase_share_info
    e.stopPropagation()
    let params = {
      item_id: item.itemId,
      num:1,
      // activity_id,
      // enterprise_id,
      // distributor_id,
      shop_type: 'distributor'
    }
    console.log('item44444ttttttt',item)
    if(item.cart_num>=Number(item.activity_store)){
      return showToast(`最多加购${item.activity_store}件`)
    }
    await api.purchase.addPurchaseCart(params)
    showToast('加入购物车成功')
    // let changeList = JSON.parse(JSON.stringify(newList))
    // changeList.map(l=>{
    //   if(l.item_id == item.item_id){
    //     l.cart_num = Number(l.cart_num) + 1
    //   }
    // })
    // await setState((draft) => {
    //   draft.newList = changeList
    // })
    // dispatch(updateCount({ shop_type: 'distributor', activity_id, enterprise_id }))
  }


  const changeList = async () => {
    const _secondList = [
      {
        name: '全部',
        img: '',
        id: ''
      },
      ...(seriesList[categoryFirstIndex]?.children || [])
    ]
    const _thirdList = _secondList[categorySecondIndex]?.children || []

    setState((draft) => {
      draft.secondList = _secondList
      draft.thirdList =
        _thirdList.length > 0
          ? [
              {
                name: '全部',
                img: '',
                id: ''
              },
              ..._thirdList
            ]
          : []
    })
  }

  return (
    <SpPage
      scrollToTopBtn
      className={classNames('page-category-item-list')}
      renderFooter={<SpTabbar />}
    >
      <View className='page-category-item-list-head'>
        <View className='category-search'>
          <SpCategorySearch onConfirm={handleConfirm} />
          {/* <View
            className={classNames('type', {
              'disable': cusIndex == 0
            })}
            onClick={onSelectClick}
          >
            <Text className='text'>{cusIndex ? '有货' : '无货'}</Text>
          </View> */}
        </View>
        <CompFirstCategory
          cusIndex={categoryFirstIndex}
          list={seriesList}
          onClick={onFirstCategoryClick}
        />
      </View>
      <View className='page-category-item-list-container'>
        <View className='left-container'>
          <CompSecondCategory
            cusIndex={categorySecondIndex}
            list={secondList}
            onClick={onSecondCategoryClick}
          />
        </View>
        <View
          className='right-container'
          style={styleNames({
            paddingTop: thirdList.length == 0 && '0px'
          })}
        >
          {thirdList.length > 0 && (
            <View className='right-container-fixed'>
              <CompThirdCategory
                cusIndex={categoryThirdIndex}
                list={thirdList}
                onClick={onThirdCategoryClick}
                typeIndex={cusIndex}
              />
            </View>
          )}
          <View className='goods-list goods-list__type-list'>
            <SpScrollView
              className='page-category-item-list-scroll'
              scrollY
              ref={goodsRef}
              fetch={fetch}
              auto={false}
            >
              {allList.map((item, index) => (
                <View className='goods-item-wrap' key={`goods-item-l__${index}`}>
                  <GoodsItem onStoreClick={handleClickStore} hideStore info={item} />
                  {item.activity_store > 0 && (
                    <View className='goods-add' onClick={shoppingCart.bind(this,item)}>
                      <Image src='https://shangpai-pic.fn-mart.com/miniprograme/gwcsmall.png' className='ckeck2' />
                      {/* <View className='at-icon at-icon-add'></View> */}
                    </View>
                  )}
                </View>
              ))}
            </SpScrollView>
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default StoreItemList
