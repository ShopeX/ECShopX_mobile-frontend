/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Swiper, SwiperItem, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpImage, SpInput as AtInput } from '@/components'
import { classNames } from '@/utils'
import api from '@/api'
import './index.scss'

function SpSearchOne(props) {
  const [state, setState] = useImmer({
    currentIndex: 0,
    focus: false,
    placeholderList: []
  })
  const placeholderRef = useRef(null)
  const indexRef = useRef(0)
  const [inputValue, setInputValue] = useState(props.value)
  useEffect(() => {
    setInputValue(props.value)
  }, [props.value])

  const handlePlaceholderClick = (e) => {
    e.stopPropagation()
    if (placeholderRef.current?.link_path) {
      const obj = JSON.parse(JSON.stringify(placeholderRef.current))
      let linkPath = JSON.parse(obj.link_path)
      delete linkPath.title
      placeholderRef.current = {
        ...obj,
        link_path: JSON.stringify(linkPath)
      }
    }
    Taro.navigateTo({
      url: `/subpages/search/index?keyword=${placeholderRef.current?.text || ''}&type=${
        props?.type || ''
      }&dtid=${props.dtid || ''}&placeholderObj=${
        placeholderRef.current ? JSON.stringify(placeholderRef.current) : ''
      }&position=${indexRef.current + 1}`
    })
  }

  const handleInput = (e) => {
    setInputValue(e)
    props.onChange(e)
  }
  const handlePlaceholderChange = (e) => {
    indexRef.current = e.detail.current
  }

  const handleSearch = () => {
    if (props.btnOnSearch && props.inputEnabled) {
      props.onSearch(
        inputValue || props.placeholder,
        !inputValue && props.placeholder && props.placeholderObj ? props.placeholderObj : null
      )
    } else {
      if (props.inputSearch) {
        props.onSearch(inputValue)
      } else {
        props.onSearch(inputValue || placeholderRef.current?.text)
      }
    }

    // if (props.btnOnSearch && props.inputEnabled && inputValue) {
    //   setTimeout(() => {
    //     setInputValue('')
    //     props.onChange('')
    //   }, 10)
    // }
  }

  const handleClose = () => {
    setInputValue('')
    props.onChange('')
  }

  return (
    <View
      className={classNames('sp-search-one', props.className, {
        'btn-show': props.searchBtn
      })}
    >
      <View
        className='sp-search-one__input-wrap'
        style={{ backgroundColor: props.backgroundColor, borderColor: props.borderColor }}
      >
        <SpImage src='fv_search.png' width={40} height={40} />
        {!props.inputEnabled && (
          <View className='sp-search-one__placeholder ml-6' onClick={handlePlaceholderClick}>
            <View className='placeholder-text text-28'>
              <Text className='omit-text'>{props.placeholder}</Text>
            </View>
          </View>
        )}

        {props.inputEnabled && (
          <AtInput
            className='sp-search-one__input ml-6'
            type='text'
            placeholder={props.placeholder}
            value={inputValue}
            onChange={handleInput}
            autoFocus={props.autoFocus}
            onFocus={() => {
              setState((draft) => {
                draft.focus = true
              })
            }}
            onBlur={() => {
              setState((draft) => {
                draft.focus = false
              })
            }}
            confirmType='search'
            onConfirm={handleSearch}
            placeholderClass='sp-search-one__placeholder'
          />
        )}

        {props.inputEnabled && (
          <SpImage
            className={classNames('sp-search-one__close', {
              'focus': state.focus && inputValue.length > 0
            })}
            src='fv_close_circle.png'
            width={40}
            onClick={handleClose}
          />
        )}
      </View>
      {props.searchBtn && (
        <View
          className='sp-search-one__search-btn'
          onClick={props.btnOnSearch ? handleSearch : handlePlaceholderClick}
        >
          <Text className='sp-search-one__search-text'>搜索</Text>
        </View>
      )}
    </View>
  )
}

SpSearchOne.defaultProps = {
  backgroundColor: '#f8f8f8',
  inputEnabled: false,
  placeholder: '搜索',
  placeholderObj: null,
  searchBtn: false,
  btnOnSearch: false,
  inputSearch: false,
  value: '',
  onChange: () => {},
  onSearch: () => {},
  borderColor: '#ebebeb',
  autoFocus: false
}

export default SpSearchOne
