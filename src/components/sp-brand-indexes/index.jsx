import React, { useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpImage } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import { navigateToStoreByDistributorId } from '@/utils'
import './index.scss'

const initialState = {
  list: [],
  activeLetter: '',
  loading: false
}

function SpBrandIndexes(props) {
  const [state, setState] = useImmer(initialState)
  const scrollRef = useRef(null)
  const indexRefs = useRef({})
  const { data, dataType, base } = props

  useEffect(() => {
    // 获取店铺列表
    if (dataType == 'all') {
      fetchShopList()
    } else {
      if (data && data.length > 0) {
        setState((draft) => {
          draft.list = formatShopList(data)
        })
      }
    }
  }, [data, dataType])

  // 获取店铺列表数据并按字母排序分组
  const fetchShopList = async () => {
    setState((draft) => {
      draft.loading = true
    })

    try {
      const params = {
        page: 1,
        pageSize: 500,
        sort_type: 5 // 按首字母升序排列
      }

      const { list } = await api.shop.getShopListByLetter(params)

      const sortedList = formatShopList(list || [])

      setState((draft) => {
        draft.list = sortedList
        draft.loading = false
        if (sortedList.length > 0) {
          draft.activeLetter = sortedList[0].key
        }
      })
    } catch (error) {
      console.error('获取店铺列表失败', error)
      setState((draft) => {
        draft.loading = false
      })
    }
  }

  const formatShopList = (_list) => {
    // 按字母分组店铺数据
    const letterGroups = {}
    _list?.forEach((shop) => {
      const letter = shop.first_letter || '#'
      if (!letterGroups[letter]) {
        letterGroups[letter] = {
          title: letter,
          key: letter,
          items: []
        }
      }

      letterGroups[letter].items.push({
        category_name: shop.category_name,
        name: shop.name,
        desc: `${shop.category_name ? `${shop.category_name}` : ''} ${
          shop.category_name && shop.online_goods_num ? ' | ' : ''
        }  ${shop.online_goods_num ? `在售${shop.online_goods_num}件商品` : ''}`,
        tag: shop.tag_name && shop.tag_name.length > 0 ? shop.tag_name[0] : '',
        img: shop.logo,
        distributor_id: shop.distributor_id
      })
    })
    const sortedList = Object.values(letterGroups).sort((a, b) => {
      if (a.key < b.key) return -1
      if (a.key > b.key) return 1
      return 0
    })
    return sortedList
  }

  const { list, activeLetter, loading } = state

  // 处理店铺点击：云店则切换店铺并跳转首页，bbc 则跳转店铺详情页
  const handleClick = async (item, pindex, index, title) => {
    await navigateToStoreByDistributorId(item.distributor_id)
  }

  // 处理字母索引点击
  const handleLetterClick = (letter) => {
    setState((draft) => {
      draft.activeLetter = letter
    })
  }

  const handleScroll = (e) => {
    setState((draft) => {
      draft.activeLetter = ''
    })
  }

  // 生成字母索引菜单
  const renderLetterMenu = () => {
    return (
      <View className='sp-brand-indexes__menu'>
        {list?.map((section) => (
          <View
            key={section.key}
            className={`sp-brand-indexes__menu-item ${
              activeLetter === section.key ? 'active' : ''
            }`}
            onClick={() => handleLetterClick(section.key)}
            data-letter={section.key}
          >
            {section.key}
          </View>
        ))}
      </View>
    )
  }

  // 生成品牌列表内容
  const renderContent = () => {
    if (loading) {
      return <View className='sp-brand-indexes__loading'>加载中...</View>
    }

    if (list.length === 0) {
      return <View className='sp-brand-indexes__empty'>暂无店铺数据</View>
    }

    return (
      <ScrollView
        className='sp-brand-indexes__content'
        scrollY
        ref={scrollRef}
        scrollIntoView={`index-${activeLetter}`}
        onScroll={handleScroll}
      >
        {list?.map((section, pindex) => (
          <View
            key={section.key}
            id={`index-${section.key}`}
            ref={(el) => (indexRefs.current[section.key] = el)}
          >
            <View className='sp-brand-indexes__section-title'>{section.title}</View>
            {section.items?.map((item, idx) => (
              <View
                key={idx}
                className='sp-brand-indexes__item'
                onClick={() => handleClick(item, pindex + 1, idx + 1, section.title)}
              >
                <View className='sp-brand-indexes__item-img'>
                  <SpImage src={item.img} width={80} height={80} mode='aspectFill' />
                </View>
                <View className='sp-brand-indexes__item-info'>
                  <View className='sp-brand-indexes__item-name-wrap'>
                    <View className='sp-brand-indexes__item-name'>{item.name}</View>
                    <View className='sp-brand-indexes__item-tag'>{item.tag}</View>
                  </View>
                  <View className='sp-brand-indexes__item-desc'>{item.desc}</View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    )
  }

  return (
    <View className='sp-brand-indexes'>
      {renderContent()}
      {renderLetterMenu()}
    </View>
  )
}

export default React.memo(SpBrandIndexes)
