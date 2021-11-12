import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpImg, SpPoint, SpPrice } from '@/components'
import api from '@/api'

import { isObject, classNames } from '@/utils'

// import "./index.scss";

function SpScrollView(props) {
  const { children } = props
  return (
    <ScrollView className={classNames('sp-scrollview')}>
      <View className='scrollview-bd'>{children}</View>
      <View className='scrollview-ft'>
        {page.isLoading && <SpLoading>正在加载...</SpLoading>}
        {page.done && page.total == 0 && (
          <SpNote icon title='没有查询到数据' button btnText='去逛逛' to={to} />
        )}
        {!page.isLoading && !page.hasNext && page.total > 0 && (
          <SpNote className='no-more' title='--没有更多数据了--'></SpNote>
        )}
      </View>
    </ScrollView>
  )
}

export default SpScrollView
