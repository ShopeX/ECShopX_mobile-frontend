/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { View, Text, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import classNames from 'classnames'
import api from '@/api'
import { platformTemplateName } from '@/utils'
import { SpImage, SpLoading, SpPoweredBy } from '@/components'
import {
  WgtShop,
  WgtStoreAlphabet,
  WgtClassify,
  WgtImgHotZone,
  WgtSlider,
  WgtFilm
} from '@/pages/home/wgts'
import './category-flat-layout.scss'

const initialState = {
  activeTab: null,
  categories: [],
  subCategories: null,
  filterWgts: [],
  loading: false
}

function CategoryFlatLayout() {
  const [state, setState] = useImmer(initialState)
  const { activeTab, categories, subCategories, filterWgts, loading } = state

  useEffect(() => {
    gettabsList()
  }, [])

  const gettabsList = async () => {
    try {
      const res = await api.category.get({})
      setState((draft) => {
        draft.categories = res
      })
      getSubCategories(res[0])
    } catch (error) {
      setState((draft) => {
        draft.loading = false
      })
    }
  }
  const getSubCategories = async (item) => {
    try {
      if (item?.customize_page_id && item?.customize_page_id != 0) {
        const query = {
          template_name: platformTemplateName,
          version: 'v1.0.1',
          // page_name: 'category',
          page_name: `custom_${item.customize_page_id}`
        }
        //有关联模版时显示模版内容
        const { list } = await api.category.getCategory(query)
        const wgts = list?.map(({ params, ...rest }) => {
          return {
            ...rest,
            ...params
          }
        })
        console.log(wgts, 'wgts')
        setState((draft) => {
          draft.filterWgts = wgts.filter((item) => item.name !== 'page')
          draft.activeTab = item.category_id
          draft.subCategories = []
          draft.loading = false
        })
      } else {
        setState((draft) => {
          draft.activeTab = item?.category_id
          draft.filterWgts = []
          draft.subCategories = item?.children
          draft.loading = false
        })
      }
    } catch (error) {
      setState((draft) => {
        draft.loading = false
      })
    }
  }
  const handleTabChange = async (item, index) => {
    getSubCategories(item)
    console.log('query', item)
  }

  const handleSubCategoryClick = (item, pindex, index, category_name) => {
    Taro.navigateTo({
      url: `/subpages/item/list?category_id=${item.category_id}&cate_name=${item.category_name}&hide_search=1`
    })
  }

  if (loading) {
    return <SpLoading />
  }

  return (
    <View className='page-category category-flat-layout'>
      <ScrollView
        scrollY
        className='category-flat-layout__main-category'
        enhanced
        bounces={false}
        showScrollbar={false}
      >
        {categories?.map((category, index) => (
          <View
            key={category.category_id}
            className={classNames('category-flat-layout__category-item', {
              'category-flat-layout__category-item--active': activeTab === category.category_id
            })}
            onClick={() => handleTabChange(category, index + 1)}
          >
            <Text className='category-flat-layout__category-name'>{category.category_name}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView
        scrollY
        className='category-flat-layout__category-content'
        enhanced
        bounces={false}
        showScrollbar={false}
      >
        <>
          {subCategories?.map((category, pindex) => (
            <View className='category-flat-layout__content' key={category.category_id}>
              <View
                className='flex justify-between pt-48 pb-24 pl-32 pr-32'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/subpages/item/list?category_id=${category.category_id}&cate_name=${category.category_name}&hide_search=1`
                  })
                }}
              >
                <View className='drak-text text-36 font-medium'>{category.category_name}</View>
                <SpImage src='fv_chevron_right.png' width={40} height={40} />
              </View>
              <View className='category-item__list'>
                {category.children?.map((item, index) => (
                  <View
                    className='category-item'
                    key={item.category_id}
                    onClick={() =>
                      handleSubCategoryClick(item, pindex + 1, index + 1, category.category_name)
                    }
                  >
                    <SpImage src={item.image_url} width={150} height={150} />
                    <View className='drak-text text-24 font-normal text-center mt-12 category-item__list__text'>
                      {item.category_name}
                    </View>
                  </View>
                ))}
              </View>

              {/* <SpClassifyVertical data={subCategories} onClick={handleSubCategoryClick} />{' '} */}
            </View>
          ))}

          {/* 模版装修 */}
          {subCategories?.length == 0 && (
            <ScrollView
              scrollY
              className='category-flat-layout__content wgt-wrap'
              style={{ height: '100%' }}
            >
              {filterWgts?.map((item, index) => (
                <>
                  {item.name == 'shop' && <WgtShop info={item} id={index + 1} />}
                  {item.name == 'storeAlphabet' && <WgtStoreAlphabet info={item} id={index + 1} />}
                  {item.name == 'classify' && <WgtClassify info={item} id={index + 1} />}
                  {item.name === 'imgHotzone' && <WgtImgHotZone info={item} id={index + 1} />}{' '}
                  {/** 热区图 */}
                  {item.name === 'slider' && (
                    <WgtSlider isHomeSearch info={item} id={index + 1} />
                  )}{' '}
                  {/** 轮播 */}
                  {item.name === 'film' && <WgtFilm info={item} id={index + 1} />} {/** 视频 */}
                </>
              ))}
              <View className='category-flat-layout__powered-by-wrap'>
                <SpPoweredBy />
              </View>
            </ScrollView>
          )}
        </>
      </ScrollView>
    </View>
  )
}

export default React.memo(CategoryFlatLayout)
