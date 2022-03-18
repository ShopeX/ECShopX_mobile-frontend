import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpSearchBar } from '@/components'
import {
  BaHomeWgts,
  BaStoreList,
  BaStore,
  BaGoodsBuyPanel,
  BaTabBar,
  BaNavBar,
  BaCoupon
} from '@/subpages/guide/components'
import './list.scss'

function GuideRecommendList(props) {
  useEffect(() => {}, [])

  return (
    <SpPage className='page-guide-recommendlist'>
      <BaNavBar home title='种草' />
      <View className='search-wrap'>
        <SpSearchBar
          keyword={keywords}
          placeholder='搜索'
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleSearchOff}
          onConfirm={handleConfirm}
        />
      </View>
      <SpScrollView className='item-list-scroll' ref={goodsRef} fetch={fetch}>
        {/* <View className='goods-list'>
          <View className='left-container'>
            {leftList.map((item, index) => (
              <View className='goods-item-wrap' key={`goods-item__${index}`}>
                <SpGoodsItem showFav onStoreClick={handleClickStore} info={item} />
              </View>
            ))}
          </View>
          <View className='right-container'>
            {rightList.map((item, index) => (
              <View className='goods-item-wrap' key={`goods-item__${index}`}>
                <SpGoodsItem showFav onStoreClick={handleClickStore} info={item} />
              </View>
            ))}
          </View>
        </View> */}
      </SpScrollView>
    </SpPage>
  )
}

GuideRecommendList.options = {
  addGlobalClass: true
}

export default GuideRecommendList
