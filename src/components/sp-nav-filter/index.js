import React, { useEffect,useImperativeHandle } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import api from '@/api'
import { classNames } from '@/utils'
import './index.scss'

const initState = {
  activeType: 0,
  typeList: [],
  visible: false,
  cateListFirst: [],
  cateListSecond: [],
  cateListThird: [],
  cateFirstIndex: 0,
  cateSecondIndex: null,
  cateThirdIndex: null,
  init: true,
  offsetHight:140,
}
function SpNavFilter(props,ref) {
  const [state, setState] = useImmer(initState)

  const {
    typeList,
    activeType,
    visible,
    cateListFirst,
    cateListSecond,
    cateListThird,
    cateFirstIndex,
    cateSecondIndex,
    cateThirdIndex,
    init,
    offsetHight
  } = state

  const { info, onChange, children } = props


  useDidShow(() => {
    //根据元素高度计算mask位置和高度
    setTimeout(()=>{
     Taro.createSelectorQuery()
          .select('.sp-nav-filter')
          .boundingClientRect((res) => {
            console.log('boundingClientRect:', res)
            if (res) {
              setState(v=>{
                v.offsetHight = res.top + res.height
              })
            }
          })
          .exec()
    },1000)
  });

  useEffect(() => {
    console.log('----', info)
    initDynamicData()
  }, [info])


  const initDynamicData = async () => {
    const _typeList = JSON.parse(JSON.stringify(info))
    setState((v) => {
      v.cateListFirst = _typeList.find((item) => item.key === 'category')?.option || []
      // _typeList[1]?.option
      v.typeList = _typeList
      v.init = true
    })
  }

  const handleTypeClick = (idx) => {
    const _cateListSecond = JSON.parse(JSON.stringify(cateListFirst[1]?.children ?? []))
    if (_cateListSecond.length) {
      _cateListSecond.unshift({ category_name: '全部', category_id: 'all' })
    }

    const _cateListThird = JSON.parse(JSON.stringify(_cateListSecond[1]?.children ?? []))
    if (_cateListThird.length) {
      _cateListThird.unshift({ category_name: '全部', category_id: 'all' })
    }

    setState((v) => {
      v.activeType = idx
      v.visible = true
      if (init) {
        v.cateFirstIndex = 1
        v.cateSecondIndex = 1
        v.cateThirdIndex = 1
        v.init = false
        v.cateListSecond = _cateListSecond
        v.cateListThird = _cateListThird
      }
    })
  }

  const handleOptionsClick = (idx) => {
    setState((v) => {
      v.typeList[activeType].activeIndex = idx
    })
  }

  const handleConfirm = () => {
    const activeIndex = typeList[activeType]?.activeIndex

    if (activeIndex === null) {
      setState((v) => {
        v.visible = false
      })
      return
    }

    const options = typeList[activeType]?.option ?? []
    setState((v) => {
      v.typeList[activeType].name = options[activeIndex].label
      v.visible = false
    })
    onChange && onChange(typeList[activeType].key, options[activeIndex].value)
  }

  const handleReset = () => {
    console.log(typeList[activeType].name)
    setState((v) => {
      v.typeList[activeType].activeIndex = null
      v.typeList[activeType].name = typeList[activeType].label
      v.visible = false
    })
    onChange && onChange(typeList[activeType].key, '')
  }

  const handleCategoryClick = async (idx, type, hasChildren) => {
    if (type === 1) {
      const _cateListSecond = JSON.parse(JSON.stringify(cateListFirst[idx]?.children ?? []))
      if (hasChildren) {
        _cateListSecond?.unshift({ category_name: '全部', category_id: 'all' })
      }
      await setState((v) => {
        v.cateFirstIndex = idx
        v.cateListSecond = _cateListSecond
        v.cateListThird = []
      })

      if (!hasChildren) {
        const categoryId = idx ? cateListFirst[idx]?.category_id : ''
        const categoryName = idx ? cateListFirst[idx]?.category_name : ''
        console.log(
          123,
          idx,
          cateSecondIndex,
          cateThirdIndex,
          cateListFirst,
          categoryId,
          categoryName
        )
        handleCategoryAction(categoryName, categoryId)
      }
    } else if (type === 2) {
      const _cateListThird = JSON.parse(JSON.stringify(cateListSecond[idx]?.children ?? []))
      if (hasChildren) {
        _cateListThird?.unshift({ category_name: '全部', category_id: 'all' })
      }
      await setState((v) => {
        v.cateSecondIndex = idx
        v.cateListThird = _cateListThird
      })
      if (!hasChildren) {
        const categoryId = idx
          ? cateListSecond[idx]?.category_id
          : cateListFirst[cateFirstIndex]?.category_id
        const categoryName = `${cateListFirst[cateFirstIndex]?.category_name}${
          idx ? '/' + cateListSecond[idx]?.category_name : ''
        }`
        console.log(
          123,
          cateFirstIndex,
          idx,
          cateThirdIndex,
          cateListFirst,
          cateListSecond,
          categoryId,
          categoryName
        )
        handleCategoryAction(categoryName, categoryId)
      }
    } else {
      await setState((v) => {
        v.cateThirdIndex = idx
      })
      if (!hasChildren) {
        const categoryId = idx
          ? cateListThird[idx]?.category_id
          : cateListSecond[cateSecondIndex]?.category_id
        const categoryName = `${cateListFirst[cateFirstIndex]?.category_name}/${
          cateListSecond[cateSecondIndex]?.category_name
        }${idx ? '/' + cateListThird[idx]?.category_name : ''}`
        console.log(
          123,
          cateFirstIndex,
          cateSecondIndex,
          idx,
          cateListSecond,
          cateListThird,
          categoryId,
          categoryName
        )
        handleCategoryAction(categoryName, categoryId)
      }
    }
  }

  const handleCategoryAction = (categoryName, categoryId) => {
    setState((v) => {
      v.typeList[activeType].name = categoryId ? categoryName : '分类'
      v.visible = false
    })
    onChange && onChange('category', categoryId)
  }

  console.log('--------',cateListSecond)

  return (
    <View className='sp-nav-filter' >
      <View className='sp-nav-filter-content'>
        {typeList.map((item, idx) => (
          <View
            className={classNames('item', { 'item-active': activeType === idx && visible })}
            key={idx}
            onClick={() => handleTypeClick(idx)}
          >
            <View className='item-name'>{item.name}</View>
            <Text className='iconfont icon-xialajiantou item-icon'></Text>
          </View>
        ))}
        {children && <View className='item'>{children}</View>}
      </View>
      {visible && (
        <View
          className='select-content'
          style={{ padding: typeList[activeType].key == 'category' ? '0' : '16px' }}
        >
          {typeList[activeType].key !== 'category' && (
            <View>
              <View className='select-content-content'>
                {typeList[activeType]?.option.map((item, idx) => (
                  <View
                    className={classNames('select-content-content-item', {
                      'active': typeList[activeType].activeIndex === idx
                    })}
                    key={idx}
                    onClick={() => handleOptionsClick(idx, item)}
                  >
                    {item.label}
                  </View>
                ))}
              </View>

              <View className='select-coontent-footer'>
                <View className='select-coontent-footer-item reset' onClick={handleReset}>
                  重置
                </View>
                <View className='select-coontent-footer-item finish' onClick={handleConfirm}>
                  完成
                </View>
              </View>
            </View>
          )}
          {typeList[activeType].key == 'category' && (
            <View className='select-content-category'>
              <View className='category-item first'>
                {cateListFirst.length > 0 &&
                  cateListFirst.map((item, idx) => (
                    <View
                      className={classNames('category-item-item', {
                        'active-first': cateFirstIndex === idx
                      })}
                      onClick={() => handleCategoryClick(idx, 1, !!item.children)}
                      key={idx}
                    >
                      <Text>{item.category_name}</Text>
                      {item.children && <Text className='at-icon at-icon-chevron-right'></Text>}
                    </View>
                  ))}
              </View>
              <View className='category-item second'>
                {cateListSecond.length > 0 &&
                  cateListSecond.map((item, idx) => (
                    <View
                      className={classNames('category-item-item', {
                        'active-second': cateSecondIndex === idx
                      })}
                      onClick={() => handleCategoryClick(idx, 2, !!item.children)}
                      key={idx}
                    >
                      <Text>{item.category_name}</Text>
                      {item.children && <Text className='at-icon at-icon-chevron-right'></Text>}
                    </View>
                  ))}
              </View>
              <View className='category-item third'>
                {cateListThird.length > 0 &&
                  cateListThird.map((item, idx) => (
                    <View
                      className={classNames('category-item-item', {
                        'active-third': cateThirdIndex === idx
                      })}
                      onClick={() => handleCategoryClick(idx, 3, !!item.children)}
                      key={idx}
                    >
                      <Text>{item.category_name}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>
      )}
      {visible && <View className='mask' style={{height:`calc(100vh - ${offsetHight}px)`,top:`${offsetHight}px`}}></View>}
    </View>
  )
}

export default SpNavFilter
