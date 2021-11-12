import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames, navigateTo } from '@/utils'
import { SpLoading, SpDefault } from '@/components'

import './index.scss'

function SpLoadMore(props) {
  const { loading = false, hasNext, total = 0, className } = props

  return (
    <View className={classNames('sp-loading-more')}>
      {loading && <SpLoading>正在加载...</SpLoading>}
      {!hasNext && total == 0 && <SpDefault type='cart' message='没有查询到数据～' />}
      {!loading && !hasNext && total > 0 && <View className='nomore-txt'>--没有更多数据了--</View>}
    </View>
  )
}

export default SpLoadMore
