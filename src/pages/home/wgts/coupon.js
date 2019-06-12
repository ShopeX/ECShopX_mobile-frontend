import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import req from '@/api/req'
import S from '@/spx'

import './coupon.scss'

// TODO: 用户信息验证
export default class WgtCoupon extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)
  }

  handleGetCard = (cardId) => {
    const { status } = req.get('/user/receiveCard', { card_id: cardId })
    if(status) {
      Taro.showToast({
        title: '优惠券领取成功',
        icon: 'success'
      })
    }
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, data } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className='wgt__subtitle'>{base.subtitle}</View>
            </View>
            <View
              className='wgt__more'
              onClick={this.navigateTo.bind(this, '/pages/home/coupon-home')}
            >
              <View className='three-dot'></View>
            </View>
          </View>
        )}
        <View className='wgt-body with-padding'>
          {data.map((item, idx) => {
            return (
              <View
                className='coupon-wgt coupon-body'
                key={idx}
                onClick={this.handleGetCard.bind(this, item.id)}
              >
                <Image src='/assets/imgs/coupon.png' className='coupon_bg'/>
                <View className='coupon-content'>
                  <View className='coupon-content__type'>
                    <Text className='coupon-content__amount'>{item.amount}</Text>
                    <Text className='coupon-content__amount-cur'>{item.type === 'cash' ? '元' : ''}{item.type === 'discount' ? '折' : ''}</Text>
                    <View className='coupon-content__typename'>
                      <Text className='coupon-content__typetext'>{item.title}</Text>
                    </View>
                  </View>
                  <View className='coupon-content__tips'>{item.desc}</View>
                </View>
                {/*<View className='coupon-brand'>
                  <Image
                    className='brand-img'
                    mode='aspectFill'
                    src={item.imgUrl}
                  />
                </View>
                <View className='coupon-caption'>
                  <View className='coupon-amount'>
                    <Text>{item.amount}</Text>
                    {item.type === 'cash' && (<Text className='amount-cur'>RMB</Text>)}
                    {item.type === 'discount' && (<Text className='amount-cur'>折</Text>)}
                  </View>
                  <View className='coupon-content'>
                    <Text className='brand-name'>{item.title}</Text>
                    <Text className='coupon-desc'>{item.desc}</Text>
                  </View>
                </View>
                <Button
                  className='coupon-getted-btn'
                  onClick={this.handleGetCard.bind(this, item.id)}
                >领取</Button>*/}
              </View>
            )})
          }

        </View>
        {/*<View className='wgt-body with-padding'>
          {data.map((item, idx) => {
            return (
              <View
                className='coupon-wgt'
                key={idx}
              >
                <View className='coupon-brand'>
                  <Image
                    className='brand-img'
                    mode='aspectFill'
                    src={item.imgUrl}
                  />
                </View>
                <View className='coupon-caption'>
                  <View className='coupon-amount'>
                    <Text>{item.amount}</Text>
                    {item.type === 'cash' && (<Text className='amount-cur'>RMB</Text>)}
                    {item.type === 'discount' && (<Text className='amount-cur'>折</Text>)}
                  </View>
                  <View className='coupon-content'>
                    <Text className='brand-name'>{item.title}</Text>
                    <Text className='coupon-desc'>{item.desc}</Text>
                  </View>
                </View>
                <Button
                  className='coupon-getted-btn'
                  onClick={this.handleGetCard.bind(this, item.id)}
                >领取</Button>
              </View>
            )
          })}
        </View>*/}
      </View>
    )
  }
}
