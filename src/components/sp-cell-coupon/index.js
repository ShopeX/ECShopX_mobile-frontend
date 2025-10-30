// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useMemo, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpCell, SpNewCoupon } from '@/components'
import './index.scss'

const SpCellCoupon = (props) => {
  const {
    couponList: couponListProp = [],
    //展示多少个
    showCount = 3,
    info
  } = props

  const handleCouponClick = useCallback(() => {
    console.log('==info==', info)
    // return ;
    Taro.navigateTo({
      url: `/subpages/marketing/coupon-center?distributor_id=${info.distributor_id}`
    })
  }, [info])

  const couponList = useMemo(() => couponListProp.slice(0, showCount), [couponListProp, showCount])

  if (couponList && couponList.length === 0) return null

  return (
    <SpCell title='领券' isLink onClick={handleCouponClick} commonStyle>
      {couponList &&
        couponList.map((item) => {
          return <SpNewCoupon text={item.title} hasStatus={false} className='margin-right-8' />
        })}
    </SpCell>
  )
}

SpCellCoupon.options = {
  addGlobalClass: true
}

export default SpCellCoupon
