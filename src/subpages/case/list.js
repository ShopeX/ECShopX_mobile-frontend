/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { View, Text, Image, Form, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtTabBar, AtSearchBar, AtButton } from 'taro-ui'
import SpTabbar from '@/components/sp-tabbar'
import { autoGetLocation } from '@/utils/wxApi'
import api from '@/api'
import SpPage from '@/components/sp-page'
import SpScrollView from '@/components/sp-scrollview'
import { classNames, pickBy, entryLaunch } from '@/utils'
import S from '@/spx'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import './list.scss'

const defaultChecked = [
  { id: 'house_all', type: 'radio', source: 'unitTypeLabelIds' },
  { id: 'style_all', source: 'styleLabelIds', type: 'radio' },
  { id: 'default', source: 'customerOrder', type: 'radio' }
]

const defaultLocationData = {
  cityName: '杭州市',
  cityId: '1438'
}

const tagListConfig = [
  {
    title: '户型',
    key: 'houseTypes'
  },
  {
    title: '风格',
    key: 'styles'
  },
  {
    title: '排序',
    key: 'sorts'
  }
]

const initialState = {
  footerHeight: 0,
  currentLocation: null,
  locationData: defaultLocationData,
  locationList: [],
  locationRange: [[], []],
  locationValue: [0, 0],
  designName: '',
  currentIndex: 0,
  checked: defaultChecked,
  downPop: false,
  rightList: [],
  leftList: [],
  params: {},
  tagContentList: {
    houseTypes: [{ tagName: '全部', id: '' }],
    styles: [{ tagName: '全部', id: '' }],
    sorts: [
      {
        tagName: '默认',
        type: 'radio',
        id: 'default',
        source: 'customerOrder'
      },
      {
        tagName: '最热',
        type: 'radio',
        id: 'hot',
        source: 'customerOrder'
      },
      {
        tagName: '最新',
        id: 'latest',
        type: 'radio',
        source: 'customerOrder'
      }
    ]
  },
  tabList: [
    {
      title: '本地案例'
    },
    {
      title: '全国案例'
    }
  ]
}

function CaseList() {
  const [state, setState] = useImmer(initialState)
  const listRef = useRef(null)

  const {
    tabList,
    currentIndex,
    locationData,
    locationRange,
    locationValue,
    tagContentList,
    designName,
    checked,
    downPop,
    rightList,
    leftList
  } = state

  const handleToggleDownPop = () => {
    setState((draft) => {
      draft.downPop = !draft.downPop
    })
  }

  const initLocationPicker = async () => {
    try {
      const res = await api.design.getLocationList()
      if (!res || !Array.isArray(res)) return

      const locationList = [
        {
          province: '全国',
          cities: [
            {
              name: '全国',
              cityid: 0
            }
          ]
        },
        ...res
      ]

      const provinces = locationList.map((item) => item.province)
      const cities = locationList[0].cities ? locationList[0].cities.map((c) => c.name) : []

      setState((draft) => {
        draft.locationList = locationList
        draft.locationRange = [provinces, cities]
        draft.locationValue = [0, 0]
      })
    } catch (e) {
      console.error('getLocationList error', e)
    }
  }

  const fetchData = async (pageInfo) => {
    const { pageIndex, pageSize } = pageInfo
    const { locationData, currentIndex, checked, designName } = state
    const customerOrder = checked.find((item) => item.source === 'customerOrder')
    const styleLabelIds = checked.filter((item) => item.source == 'styleLabelIds')
    const unitTypeLabelIds = checked.filter((item) => item.source == 'unitTypeLabelIds')
    let unitIds = []
    let styleIds = []

    const options = {
      page: pageIndex,
      pageSize
    }
    if (designName) options.keywords = designName
    if (customerOrder && customerOrder.id != 'default') {
      options.sort = customerOrder.id
    }
    if (unitTypeLabelIds.length > 0 && !unitTypeLabelIds[0].id.includes('all')) {
      unitIds = unitTypeLabelIds.map((item) => ({
        tag_id: item.id,
        tag_category_id: item.categoryId
      }))
    }
    if (styleLabelIds.length > 0 && !styleLabelIds[0].id.includes('all')) {
      styleIds = styleLabelIds.map((item) => ({
        tag_id: item.id,
        tag_category_id: item.categoryId
      }))
    }
    if (unitIds.length > 0 || styleIds.length > 0) {
      options.tags_params = [...unitIds, ...styleIds]
    }

    if (currentIndex != 1 || locationData.cityId != 0) {
      options.city_id = locationData.cityName
    }
    const res = await api.design.getDesignList(options)
    const { total_count, list: nList } = res
    const list = pickBy(nList, doc.case.CASE_LIST)

    const nleftList = []
    const nrightList = []
    list.forEach((item, index) => {
      const pushLeft = (index + 1) % 2 == 1
      if (pushLeft) {
        nleftList.push(item)
      } else {
        nrightList.push(item)
      }
    })

    setState((draft) => {
      draft.leftList.push(...nleftList)
      draft.rightList.push(...nrightList)
    })

    return {
      total: Number(total_count)
    }
  }

  const refresh = () => {
    setState((draft) => {
      draft.leftList = []
      draft.rightList = []
    })
    if (listRef.current && typeof listRef.current.reset === 'function') {
      listRef.current.reset()
    }
  }

  const getStorageLocation = async () => {
    const currentLocation = S.get('currentLocation')
    if (currentLocation) {
      const data = await entryLaunch.getAddressByLnglatWebAPI(
        currentLocation.longitude,
        currentLocation.latitude
      )
      const { city, error } = data
      if (error) {
        setState((draft) => {
          draft.locationData = defaultLocationData
        })
        refresh()
        return
      }
      setState((draft) => {
        draft.locationData = { cityName: city, cityId: '1438' }
        draft.currentLocation = currentLocation
      })
      refresh()
    } else {
      setState((draft) => {
        draft.locationData = defaultLocationData
      })
      refresh()
    }
  }

  const handleAutoGetLoaction = () => {
    autoGetLocation().then((data) => {
      const { latitude, longitude } = data
      S.set('currentLocation', {
        latitude,
        longitude
      })
      getStorageLocation()
    })
  }

  const handleToggleTab = (value) => {
    setState((draft) => {
      draft.currentIndex = value
    })
    if (value == 0) {
      getStorageLocation()
    } else {
      setState((draft) => {
        draft.locationData = {
          cityName: '全国',
          cityId: 0
        }
        if (draft.locationList && draft.locationList.length > 0) {
          draft.locationValue = [0, 0]
          const firstProvince = draft.locationList[0]
          const cities = firstProvince && firstProvince.cities ? firstProvince.cities : []
          draft.locationRange[1] = cities.map((c) => c.name)
        }
      })
      refresh()
    }
  }

  const handleSubmitSelect = () => {
    refresh()
    handleToggleDownPop()
  }

  const handleResetChecked = () => {
    setState((draft) => {
      draft.checked = defaultChecked
    })
  }

  const handleDesignNameChange = (value) => {
    setState((draft) => {
      draft.designName = value
    })
    return value
  }

  const handleDesignNameClear = () => {
    setState((draft) => {
      draft.designName = ''
    })
    refresh()
  }

  const handleColumnChange = (e) => {
    const { column, value } = e.detail
    setState((draft) => {
      if (column === 0) {
        draft.locationValue[0] = value
        draft.locationValue[1] = 0
        const currentProvince = draft.locationList[value]
        const cities = currentProvince && currentProvince.cities ? currentProvince.cities : []
        draft.locationRange[1] = cities.map((c) => c.name)
      } else if (column === 1) {
        draft.locationValue[1] = value
      }
    })
  }

  const handleLocationPickerChange = (e) => {
    const [provinceIndex, cityIndex] = e.detail.value || [0, 0]
    setState((draft) => {
      const province = draft.locationList[provinceIndex]
      const city =
        province && province.cities && province.cities[cityIndex]
          ? province.cities[cityIndex]
          : null
      if (city) {
        draft.locationData = {
          cityId: city.cityid != null ? city.cityid : city.city_id || 0,
          cityName: city.name || city.city || ''
        }
        draft.locationValue = [provinceIndex, cityIndex]
      }
    })
    refresh()
  }

  const handleSelectTag = (item) => {
    setState((draft) => {
      const checked = draft.checked || []
      if (item.type == 'radio') {
        const nChecked = checked.filter((iitem) => {
          return !(item.source == iitem.source && item.type == iitem.type)
        })
        nChecked.push(item)
        draft.checked = nChecked
      } else {
        const exists = checked.find((iitem) => item.id === iitem.id)
        if (!exists) {
          checked.push(item)
        }
      }
    })
  }

  const handleNavtoDetail = (item) => {
    const { design_id, plan_id } = item
    Taro.navigateTo({
      url: `/subpages/case/detail?design_id=${design_id}&plan_id=${plan_id}`
    })
  }

  useEffect(() => {
    getStorageLocation()
    api.design.getDesignTagsList().then((data) => {
      let house_type, style
      data.forEach((item) => {
        if (item.tag_category_name === '户型') {
          house_type = item.tags.map((iitem) => {
            return {
              id: iitem.tag_id,
              categoryId: item.tag_category_id,
              tagName: iitem.tag_name
            }
          })
        } else if (item.tag_category_name === '风格') {
          style = item.tags.map((iitem) => {
            return {
              id: iitem.tag_id,
              categoryId: item.tag_category_id,
              tagName: iitem.tag_name
            }
          })
        }
      })
      house_type.unshift({
        id: 'house_all',
        tagName: '全部'
      })
      style.unshift({
        id: 'style_all',
        tagName: '全部'
      })
      setState((draft) => {
        draft.tagContentList = {
          ...draft.tagContentList,
          houseTypes: house_type.map((item) => {
            item.source = 'unitTypeLabelIds'
            item.type = 'radio'
            return item
          }),
          styles: style.map((item) => {
            item.source = 'styleLabelIds'
            item.type = 'radio'
            return item
          })
        }
      })
    })
    initLocationPicker()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className='sp-case-list'>
      <SpPage
        onReady={({ footerHeight }) => {
          setState((draft) => {
            draft.footerHeight = footerHeight
          })
        }}
        renderFooter={<SpTabbar height={state.footerHeight} />}
      >
        <View className='sp-case-list--head'>
          <AtTabBar
            className='sp-top--tab'
            onClick={handleToggleTab}
            tabList={tabList}
            current={currentIndex}
          />
          <View className='sp-search'>
            {currentIndex == 0 && (
              <View onClick={handleAutoGetLoaction}>
                <Text className='sp-case-list--head-city'>{locationData.cityName}</Text>
              </View>
            )}
            {currentIndex == 1 && (
              <Picker
                mode='multiSelector'
                value={locationValue}
                range={locationRange}
                onColumnChange={handleColumnChange}
                onChange={handleLocationPickerChange}
              >
                <Text className='sp-search--city'>{locationData.cityName}</Text>
              </Picker>
            )}

            <View className='sp-search--content'>
              <Form onSubmit={refresh}>
                <AtSearchBar
                  placeholder='搜索文案'
                  value={designName}
                  onClear={handleDesignNameClear}
                  onChange={handleDesignNameChange}
                  onActionClick={refresh}
                  onConfirm={refresh}
                />
              </Form>
            </View>
          </View>
          <View className='sp-tag'>
            <View className='sp-tag--head'>
              <View className='sp-tag--head-list'>
                {tagListConfig.map((item, index) => {
                  const checkedGroupkey = checked
                    ? checked.find((checkedItem) => {
                        return tagContentList[item.key].find((iitem) => iitem.id === checkedItem.id)
                      })
                    : null
                  const itemCls = classNames('sp-tag--head-item', {
                    'sp-tag--head-checked': !!checkedGroupkey
                  })
                  return (
                    <View
                      className={itemCls}
                      key={index + item.title}
                      onClick={handleToggleDownPop}
                    >
                      <Text>{item.title}</Text>
                      <Text className='at-icon at-icon-chevron-down sp-tag--head-item--icon'></Text>
                    </View>
                  )
                })}
                <View onClick={handleToggleDownPop} className='iconfont icon-shaixuan1'></View>
              </View>
            </View>
            {downPop && (
              <View className='sp-tag--content'>
                <View className='sp-tag--content-group'>
                  {Object.keys(tagContentList).map((key) => {
                    const itemDetail = tagListConfig.find((item) => item.key == key)
                    const itemTitle = itemDetail ? itemDetail.title : ''
                    const tag_list = tagContentList[key] ? tagContentList[key] : []
                    return (
                      <View key={key} className='sp-tag--content-wrap'>
                        <View className='sp-tag--content-title'>{itemTitle}:</View>
                        <View className='sp-tag--content-list'>
                          {tag_list.map((item) => {
                            const isChecked = checked
                              ? checked.find((iitem) => item.id === iitem.id)
                              : false
                            const tagCls = classNames('sp-tag--content-item', {
                              'sp-tag--content-checked': isChecked
                            })
                            return (
                              <View
                                onClick={() => handleSelectTag(item)}
                                className={tagCls}
                                key={item.id + item.source}
                              >
                                {item.tagName}
                              </View>
                            )
                          })}
                        </View>
                      </View>
                    )
                  })}
                </View>
                <View className='sp-tag--content-action'>
                  <View>
                    <AtButton
                      onClick={handleResetChecked}
                      type='secondary'
                      className='sp-tag--content-action-btn sp-tag--content-action-reset'
                    >
                      重置
                    </AtButton>
                  </View>
                  <View>
                    <AtButton
                      type='primary'
                      onClick={handleSubmitSelect}
                      className='sp-tag--content-action-btn sp-tag--content-action-submit'
                    >
                      确认
                    </AtButton>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        <SpScrollView className='sp-scroll-y' fetch={fetchData} auto={false} ref={listRef}>
          <View className='sp-case-list--wrap'>
            <View className='sp-case-list--right'>
              {leftList.map((item) => {
                return (
                  <View
                    className='sp-case-list--item'
                    key={item.id}
                    onClick={() => handleNavtoDetail(item)}
                  >
                    <Image
                      lazyLoad
                      className='sp-case-list--item-image'
                      mode='widthFix'
                      src={item.cover_pic}
                    ></Image>
                    <View className='sp-case-list--item-desc'>
                      <View className='sp-case-list--item-desc-title'>{item.design_name}</View>
                      <View className='sp-case-list--group'>
                        <View className='sp-case-list--item-content'>
                          {item.tagList.map((style) => {
                            return (
                              <View className='sp-case-list--item-content-tag' key={style.tag_name}>
                                {style.tag_name}
                              </View>
                            )
                          })}
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
            <View className='sp-case-list--left'>
              {rightList.map((item) => {
                return (
                  <View
                    className='sp-case-list--item'
                    key={item.id}
                    onClick={() => handleNavtoDetail(item)}
                  >
                    <Image
                      lazyLoad
                      className='sp-case-list--item-image'
                      mode='widthFix'
                      src={item.cover_pic}
                    ></Image>
                    <View className='sp-case-list--item-desc'>
                      <View className='sp-case-list--item-desc-title'>{item.design_name}</View>
                      <View className='sp-case-list--group'>
                        <View className='sp-case-list--item-content'>
                          {item.tagList.map((style) => {
                            return (
                              <View className='sp-case-list--item-content-tag' key={style.tag_name}>
                                {style.tag_name}
                              </View>
                            )
                          })}
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        </SpScrollView>
      </SpPage>
    </View>
  )
}

export default CaseList
