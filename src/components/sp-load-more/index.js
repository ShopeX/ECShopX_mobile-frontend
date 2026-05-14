/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { classNames, navigateTo } from '@/utils'
import { SpLoading, SpDefault } from '@/components'
import { $t } from '@/i18n'

import './index.scss'

function SpLoadMore(props) {
  const { loading = false, hasNext, total = 0, className } = props

  return (
    <View className={classNames('sp-loading-more')}>
      {loading && <SpLoading>{$t('10293ac1.bd0271')}</SpLoading>}
      {!hasNext && total == 0 && <SpDefault type='cart' message={$t('c575112f.f1f45e')} />}
      {!loading && !hasNext && total > 0 && (
        <View className='nomore-txt'>{$t('8a819f4f.a25652')}</View>
      )}
    </View>
  )
}

export default SpLoadMore
