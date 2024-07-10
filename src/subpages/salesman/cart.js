import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompTabbar from './comps/comp-tabbar'
import CompGoodsItems from './comps/comp-goodsitems'

import './cart.scss'

const initialConfigState = {
  allChecked: true
}

const Cart = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { allChecked } = state

  return (
    <SpPage classNames='page-cart' renderFooter={<CompTabbar />}>
      <CompGoodsItems />
    </SpPage>
  )
}

export default Cart
