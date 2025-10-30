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
import React, { PureComponent } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { CouponItem } from '@/components'
import { AtModal } from 'taro-ui'
import { withPager } from '@/hocs'

import './index.scss'

export default class CouponModal extends PureComponent {
  static defaultProps = {
    visible: false
  }

  static options = {
    addGlobalClass: true
  }

  render() {
    const { list, visible, onChange } = this.props

    return (
      <View className='coupon-modal'>
        <AtModal isOpened={visible} closeOnClickOverlay={false}>
          <View className='title'>
            福利专享券
            <View
              className='iconfont icon-close poster-close-btn'
              onClick={() => onChange(false, 'close')}
            ></View>
          </View>
          <ScrollView scrollY className='coupon-scroll'>
            <View className='coupon-list-ticket'>
              {list &&
                list.map((item, idx) => {
                  let time = parseInt(new Date().getTime() / 1000)
                  return (
                    <CouponItem info={item} key={item.card_id}>
                      <View
                        style={{ fontSize: '22rpx' }}
                        onClick={this.handleClickNews.bind(this, item, idx)}
                      >
                        待领取
                        {/* {item.getted === 1 ? '已领取' : ''}
                        {item.getted === 2 ? '已领完' : ''}
                        {(time > parseInt(new Date(item.begin_date).getTime() / 1000) && item.getted !== 2 && item.getted !== 1) ? '待领取' : ''}
                        {(item.card_type === 'new_gift' && time < parseInt(new Date(item.begin_date).getTime() / 1000)) ? '未开始' : ''} */}
                      </View>
                    </CouponItem>
                  )
                })}
            </View>
          </ScrollView>
          <View onClick={() => onChange(false, 'jump')} className='button'>
            放入券包
          </View>
        </AtModal>
      </View>
    )
  }
}
