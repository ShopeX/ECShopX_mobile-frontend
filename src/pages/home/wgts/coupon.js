import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { QnImg, SpToast } from '@/components'
import req from '@/api/req'
import S from '@/spx'
import { classNames } from '@/utils'

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
    if (!S.getAuthToken()) {
      S.toast('请先登录再领取')

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    req.get('/user/receiveCard', { card_id: cardId })
      .then(res => {
        if(res.status) {
          S.toast('该券已经领取成功，赶快购物吧！')
        }
      })
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  render () {
    const { info, dis_id = '' } = this.props
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
              onClick={this.navigateTo.bind(this, `/pages/home/coupon-home?dis_id=${dis_id}`)}
            >
              <View className='three-dot'></View>
            </View>
          </View>
        )}
        <View className='wgt__body with-padding'>
          {data.map((item, idx) => {
            return (
              <View
                className={classNames('coupon-wgt', item.imgUrl && 'with-img')}
                key={idx}
              > {
                  item.imgUrl
                  ? <QnImg
                    img-class='coupon_img'
                    src={item.imgUrl}
                    mode='widthFix'
                    width='750'
                  />
                  : <View className='coupon-body'>
                      <View className='coupon__amount'>
                        <Text>{item.amount}</Text>
                        <View className='coupon__amount-cur'>{item.type === 'cash' ? '元' : ''}{item.type === 'discount' ? '折' : ''}</View>
                      </View>
                      <View className='coupon-caption'>
                        <View className='coupon-content'>
                          <View className='coupon-content__brand-name'>{item.title}</View>
                          <View className='coupon-content__coupon-desc'>{item.desc}</View>
                        </View>
                      </View>
                  </View>
                }
                <Button
                  className='coupon-btn__getted'
                  onClick={this.handleGetCard.bind(this, item.id)}
                >领取</Button>
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
        <SpToast />
      </View>
    )
  }
}
