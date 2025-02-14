import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro, { useDidShow, getCurrentInstance } from '@tarojs/taro'
import { Text, View, Image, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import {
  SpScrollView,
  SpPage,
  SpTabbar,
  SpCategorySearch,
  SpSkuSelect,
  SpLogin
} from '@/components'
import api from '@/api'
import doc from '@/doc'
import { useDebounce } from '@/hooks'
import S from '@/spx'
import { platformTemplateName } from '@/utils/platform'
import { pickBy, classNames, styleNames, showToast, VERSION_PLATFORM, entryLaunch } from '@/utils'
import CompFirstCategory from './comp-first-category'
import CompSecondCategory from './comp-second-category'
import CompThirdCategory from './comp-third-category'
import CompGoodsItem from './comp-goods-item'
import './comps-category-addCart.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

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
  cat_type: undefined,
  show: false,
  secondList: [],
  thirdList: [],
  info: null,
  skuPanelOpen: false,
  selectType: 'picker'
}

function CompsCategoryAddCart(props) {
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
    cat_type,
    secondList,
    thirdList,
    info,
    skuPanelOpen,
    selectType
  } = state

  const goodsRef = useRef()
  const pageRef = useRef()
  const loginRef = useRef()
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

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])


  // 上个版本的分类逻辑，不删除保留，防止后面产品变卦
  // const getCategoryList = async () => {
  //   let currentList = []

  //   const query = { template_name: platformTemplateName, version: 'v1.0.1', page_name: 'category' }
  //   const { list } = await api.category.getCategory(query)
  //   const seriesList = (list[0] && list[0].params.data[0]?.content) || []
  //   if(seriesList){
  //     //type  false:main_category 管理分类  true:category_id 销售分类
  //     seriesList.forEach(element => {
  //       element.id = element.category_id || element.main_category_id
  //       element.name = element.name || element.category_name
  //       element.type = element.category_id?true:false
  //       element?.children.forEach(val => {
  //         val.id = val.category_id || val.main_category_id
  //         val.name = val.name || val.category_name
  //         val.type = val.category_id?true:false
  //         val?.children.forEach(ele => {
  //           ele.id = ele.category_id || ele.main_category_id
  //           ele.name = ele.name || ele.category_name
  //           ele.type = ele.category_id?true:false
  //         });
  //       });
  //     });
  //   }
  //   console.log(seriesList, '.......seriesList......seriesList')
  //   if (!seriesList.length) {
  //     //不存在数据读取销售分类
  //     const res = await api.category.get()
  //     currentList = pickBy(res, {
  //       name: 'category_name',
  //       img: 'image_url',
  //       id: 'category_id',
  //       type:true,
  //       category_id: 'category_id',
  //       children: ({ children }) =>
  //         pickBy(children, {
  //           name: 'category_name',
  //           img: 'image_url',
  //           id: 'category_id',
  //           type:true,
  //           category_id: 'category_id',
  //           children: ({ children: children_ }) =>
  //             pickBy(children_, {
  //               name: 'category_name',
  //               img: 'image_url',
  //               type:true,
  //               id: 'category_id'
  //             })
  //         })
  //     })
  //   } else {
  //     currentList = pickBy(seriesList, {
  //       name: 'name',
  //       img: 'img',
  //       id: 'id',
  //       type:'type',
  //       category_id: 'id',
  //       children: ({ children }) =>
  //         pickBy(children, {
  //           name: 'name',
  //           img: 'img',
  //           id: 'id',
  //           type:'type',
  //           category_id: 'id',
  //           children: ({ children }) =>
  //             pickBy(children, {
  //               name: 'name',
  //               img: 'img',
  //               id: 'id',
  //               type:'type'
  //             })
  //         })
  //     })
  //   }
  //   console.log(currentList,'currentList==========');
  //   setState((draft) => {
  //     draft.seriesList = currentList
  //     draft.hasSeries = true
  //     draft.cat_id = currentList[0].id
  //     draft.cat_type = currentList[0]?.type
  //   })
  // }

  const getCategoryList = async () => {
    // ecsahopex ：商品管理分类   云店/官网/内购：商品销售分类
    const res = await api.category.get(VERSION_PLATFORM ? { is_main_category: 1 } : {})

    const currentList = pickBy(res, {
      name: 'category_name',
      img: 'image_url',
      id: 'category_id',
      type: !VERSION_PLATFORM,
      category_id: 'category_id',
      children: ({ children }) =>
        pickBy(children, {
          name: 'category_name',
          img: 'image_url',
          id: 'category_id',
          type: !VERSION_PLATFORM,
          category_id: 'category_id',
          children: ({ children: children_ }) =>
            pickBy(children_, {
              name: 'category_name',
              img: 'image_url',
              type: !VERSION_PLATFORM,
              id: 'category_id'
            })
        })
    })

    setState((draft) => {
      draft.seriesList = currentList
      draft.hasSeries = true
      draft.cat_id = currentList[0].id
      draft.cat_type = currentList[0]?.type
    })

  }

  const fetch = async ({ pageIndex, pageSize }) => {
    const { dis_id = null } = $instance.router.params
    const params = {
      page: pageIndex,
      pageSize,
      keywords: keywords,
      approve_status: 'onsale,only_show',
      item_type: 'normal',
      is_point: 'false',
      distributor_id: dis_id || Taro.getStorageSync('distributor_id'),
      goodsSort,
      // category_id: cat_id,
      v_store: cusIndex
    }
    if (cat_type) {
      params.category_id = cat_id
    } else {
      params.main_category = cat_id
    }

    const { list: _list, total_count } = await api.item.search(params)

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
        url: `/pages/item/list?keywords=${val}`
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
      draft.cat_type = seriesList[index]?.type
    })
  }, 200)

  const onSecondCategoryClick = useDebounce((index) => {
    if (categorySecondIndex == index) return
    setState((draft) => {
      draft.categorySecondIndex = index
      draft.categoryThirdIndex = 0
      draft.allList = []
      draft.cat_id = index == 0 ? seriesList[categoryFirstIndex]?.id : secondList[index]?.id
      draft.cat_type = index == 0 ? seriesList[categoryFirstIndex]?.type : secondList[index]?.type
    })
  }, 200)

  const onThirdCategoryClick = useDebounce((index) => {
    if (categoryThirdIndex == index) return
    setState((draft) => {
      draft.categoryThirdIndex = index
      draft.allList = []
      draft.cat_id = index == 0 ? secondList[categorySecondIndex]?.id : thirdList[index]?.id
      draft.cat_type = index == 0 ? secondList[categorySecondIndex]?.type : thirdList[index]?.type
    })
  }, 200)

  const onSelectClick = () => {
    setState((draft) => {
      draft.cusIndex = cusIndex === 1 ? 0 : 1
      draft.allList = []
    })
    goodsRef?.current.reset()
  }

  const shoppingCart = async (item, e) => {
    e.stopPropagation()
    let params = {
      item_id: item.itemId,
      num: 1,
      shop_type: 'distributor'
    }
    if (item.cart_num >= Number(item.activity_store)) {
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
  }

  const handleAddToCart = async ({ itemId, distributorId }) => {
    if (!S.getAuthToken()) {
      loginRef.current?.handleToLogin()
      return
    }

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
      className={classNames('page-category-index-old')}
      renderFooter={<SpTabbar />}
      ref={pageRef}
    >
      <View className='container-hd'>
        <View className='category-search'>
          <SpCategorySearch onConfirm={handleConfirm} />
        </View>
        <CompFirstCategory
          cusIndex={categoryFirstIndex}
          list={seriesList}
          onClick={onFirstCategoryClick}
        />
      </View>
      <View className='container-bd'>
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
          <ScrollView className='goods-list-container' scrollY>
            <SpScrollView className='scroll-view-goods' ref={goodsRef} fetch={fetch} auto={false}>
              {allList.map((item, index) => (
                <View className='goods-item-wrap' key={`goods-item-l__${index}`}>
                  <CompGoodsItem
                    onStoreClick={handleClickStore}
                    onAddToCart={handleAddToCart}
                    hideStore
                    info={item}
                  />
                </View>
              ))}
            </SpScrollView>
          </ScrollView>
        </View>
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

      <SpLogin ref={loginRef} />
    </SpPage>
  )
}

export default CompsCategoryAddCart
