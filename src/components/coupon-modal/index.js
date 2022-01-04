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

  render () {
    const { list, visible, onChange } = this.props

    return (
      <View className='coupon-modal'>
        <AtModal isOpened={visible} closeOnClickOverlay={false}>
          <View className='title'>
            福利专享券
            <View
              className='icon-close poster-close-btn'
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
