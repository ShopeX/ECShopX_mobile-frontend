import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import './selectStore.scss'

const initialConfigState = {
  funcList: [
    { name: '订单管理', icon: 'present' },
    { name: '代客下单', icon: 'present' },
    { name: '业务员推广', icon: 'present' },
    { name: '商家列表', icon: 'present' },
  ]
}

const Index = () => {
  const [data, setData] = useImmer(initialConfigState)

  return (
    <SpPage className={classNames('page-selectStore')}
    renderFooter={<CompTabbar/>}
    >
      选店铺
    </SpPage>
  )
}

export default Index
