import { View, Text } from '@tarojs/components'
import React, { useEffect, useState, useRef } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { classNames } from '@/utils'
import { AtSearchBar, AtForm } from 'taro-ui'
import './index.scss'

const initialState = {
  showBar: false,
  showSearchDailog: false,
  isShowAction: false,
  historyList: [],
  keyword: ''
}
function SpCategorySearch(props) {
  const [state, setState] = useImmer(initialState)
  const { showBar, showSearchDailog, isShowAction, historyList, keyword } = state
  const { placeholder = '搜索', onConfirm = () => {} } = props
  useEffect(() => {
    console.log(showBar, '----')
    setState((draft) => {
      draft.showSearchDailog = showBar
    })
    if (showBar) {
      handleFocusSearchHistory()
    }
  }, [showBar])
  useEffect(() => {
    setState((draft) => {
      draft.isShowAction = !!keyword
    })
  }, [keyword])

  const handleChangeShow = async () => {
    setState((draft) => {
      draft.showBar = true
    })
  }
  const handleFocusSearchHistory = () => {
    Taro.getStorage({ key: 'searchHistory' })
      .then((res) => {
        let stringArr = res.data.split(',').filter((item) => {
          const isHave = item.trim()
          return isHave
        })
        setState((draft) => {
          draft.historyList = stringArr
        })
      })
      .catch(() => {})
  }
  const handleClickDelete = () => {
    Taro.removeStorage({ key: 'searchHistory' }).then(() => {
      setState((draft) => {
        draft.historyList = []
      })
    })
  }
  const handleClear = async () => {
    setState((draft) => {
      draft.keyword = ''
    })
  }
  const handleChangeSearch = async (value) => {
    setState((draft) => {
      draft.keyword = value
    })
  }
  const handleConfirm = async (e) => {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
    const keywords = e.detail.value.trim()
    if (keywords) {
      const value = Taro.getStorageSync('searchHistory')
      let defaultValue = []
      if (value) {
        const array = value.split(',')
        if (!array.includes(keywords)) {
          array.unshift(keywords)
        }
        defaultValue = array
      } else {
        defaultValue.push(keywords)
      }
      Taro.setStorage({ key: 'searchHistory', data: defaultValue.toString() })
    }
    setState((draft) => {
      draft.showBar = false
      draft.keyword = ''
    })
    onConfirm(e.detail.value)
  }
  const handleClickCancel = () => {
    setState((draft) => {
      draft.showBar = false
    })
  }
  const handleClickTag = (item) => {
    onConfirm(item)
    setState((draft) => {
      draft.showBar = false
    })
  }
  return (
    <View className='sp-category-search'>
      {!showBar ? (
        <View className='search-wrap-input' onClick={() => handleChangeShow()}>
          <View className='at-icon at-icon-search'></View>
          <View
            className={classNames('search-input-content', {
              'search-input-content-active': keyword
            })}
          >
            {keyword ? keyword : placeholder}
          </View>
        </View>
      ) : (
        <View className='sp-category-search-fixed'>
          <AtSearchBar
            className='sp-category-search__bar'
            value={keyword}
            placeholder={placeholder}
            actionName='取消'
            showActionButton={isShowAction}
            onClear={handleClear}
            onChange={handleChangeSearch}
            onConfirm={handleConfirm}
            onActionClick={handleClickCancel}
            focus
          />
          <View
            className={classNames(
              showSearchDailog ? 'sp-category-search__history' : 'sp-category-search__history-none'
            )}
          >
            <View className='sp-category-search__history-title'>
              <Text className='title'>最近搜索{showBar}</Text>
              <Text className='icon-trashCan icon-del clear-history' onClick={handleClickDelete}>
                清除搜索历史
              </Text>
            </View>
            <View className='sp-category-search__history-list'>
              {historyList?.map((item, index) => (
                <View
                  className='sp-category-search__history-list__btn sp-category-search-border'
                  key={`${index}1`}
                  onClick={() => handleClickTag(item)}
                >
                  {item}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default SpCategorySearch
