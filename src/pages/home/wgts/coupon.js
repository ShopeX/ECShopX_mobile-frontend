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
    this.state = {
      hasAuth: false
    }
  }

  handleGetUserInfo = () => {
    if (this.state.hasAuth) return

    Taro.redirectTo({
      url: '/pages/auth/login'
    })
  }

  handleGetCard = (cardId) => {
    let data = {}
    try {
      data = req.get('http://pjj.aixue7.com/index.php/api//wxapp/user/receiveCard', { card_id: cardId })
    } catch (e) {
      S.showToast('优惠券领取失败')
    }

    if (data.status) {
      S.showToast('优惠券领取成功')
    }
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  render () {
    const { hasAuth } = this.state
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
              onClick={this.navigateTo.bind(this, '/pages/coupon/list')}
            >
              <View className='three-dot'></View>
            </View>
          </View>
        )}
        <View className='wgt-body with-padding'>
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
                {!hasAuth && (
                  <Button
                    className='coupon-getted-btn'
                    openType='getUserInfo'
                    onClick={this.handleGetUserInfo}
                  >领取</Button>
                )}
                {hasAuth && (
                  <Button
                    className='coupon-getted-btn'
                    onClick={this.handleGetCard.bind(this, item.id)}
                  >领取</Button>
                )}
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
