import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { CouponItem } from '@/components'
import { AtModal } from "taro-ui"
import { withPager } from '@/hocs'

import './index.scss'

@withPager
export default class SpToolbar extends PureComponent {
  defaultProps = {
    visible: false
  }

  state = {
    ...this.state
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { list, visible, onChange } = this.props
    console.log(list, visible)

    return (
      <View className='coupon-modal'>
        <AtModal
          isOpened={visible}
          closeOnClickOverlay={false}
          onClose={() => onChange(false)} className='wheel-prize'
        >
          <View className='title'>
            福利专享券
            <View
              className='icon-close poster-close-btn'
              onClick={() => onChange(false)}
            ></View>
          </View>
          <ScrollView
            scrollY
            className='coupon-scroll'
            // onScrollToLower={this.nextPage}
          >
            <View className='coupon-list-ticket'>
              {
                list.map((item, idx) => {
                  let time = parseInt(new Date().getTime() / 1000)
                  return (
                    <CouponItem
                      info={item}
                      key={item.card_id}
                    >
                      {/* <Text
                        className={`coupon-btn ${(item.getted === 2 || item.getted === 1) ? 'coupon-btn__done' : ''}`}
                        onClick={this.handleGetCard.bind(this, item, idx)}
                      >
                        {item.getted === 1 ? '已领取' : ''}
                        {item.getted === 2 ? '已领完' : ''}
                        {(item.getted !== 2 && item.getted !== 1) ? '立即领取' : ''}
                      </Text> */}
                      <View
                        style={{fontSize: '22rpx'}}
                        // className={`coupon-btn ${(item.getted === 2 || item.getted === 1) ? 'coupon-btn__done' : ''}`}
                        // style={`background: ${colors.data[0].primary}`}
                        onClick={this.handleClickNews.bind(this, item, idx)}
                      >
                        {item.getted === 1 ? '已领取' : ''}
                        {item.getted === 2 ? '已领完' : ''}
                        {(time > item.send_begin_time && item.getted !== 2 && item.getted !== 1) ? '立即领取' : ''}
                        {(item.card_type === 'new_gift' && time < item.send_begin_time) ? '未开始' : ''}
                      </View>
                    </CouponItem>
                  )
                })
              }
            </View>
          </ScrollView>
          <View className='button'>放入券包</View>
        </AtModal>
      </View>
    )
  }
}