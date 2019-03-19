import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtBadge, AtIcon, AtAvatar } from 'taro-ui'
import { SpIconMenu, TabBar } from '@/components'
import { withLogin } from '@/hocs'
import api from '@/api'

import './index.scss'

@withLogin()
export default class MemberIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ordersCount: {
        normal_payed_delivered: '',
        normal_payed_notdelivery: ''
      }
    }
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  componentDidShow () {
    api.trade.getCount()
      .then((ordersCount) => {
        this.setState({
          ordersCount
        })
      })
  }

  render () {
    const { ordersCount } = this.state

    return (
      <View className='page-member-index'>
        <View className='member-index__hd'>
          <View className='member-info'>
            <AtAvatar
              className='member-avatar'
              title='鲜果优格果冻妹'
              size='large'
              circle
            />
            <View className='member-name'>鲜果优格果冻妹</View>
          </View>
        </View>

        <View className='member-index__bd'>
          <View className='member-sec member-info__status'>
            <View className='member-status__item' onClick={this.navigateTo.bind(this, '/pages/member/favorite')}>
              <Text className='member-status__item-val'>666</Text>
              <Text className='member-status__item-title'>收藏夹</Text>
            </View>
            <View className='member-status__item' onClick={this.navigateTo.bind(this, '/pages/member/point')}>
              <Text className='member-status__item-val'>666</Text>
              <Text className='member-status__item-title'>积分</Text>
            </View>
            <View className='member-status__item' onClick={this.navigateTo.bind(this, '/pages/member/coupon')}>
              <Text className='member-status__item-val'>666</Text>
              <Text className='member-status__item-title'>优惠券</Text>
            </View>
            <View className='member-status__item' onClick={this.navigateTo.bind(this, '/pages/member/point-draw-order')}>
              <Text className='member-status__item-val'>666</Text>
              <Text className='member-status__item-title'>消息</Text>
            </View>
          </View>

          <View className='member-sec member-trades'>
            <View className='sec-hd'>
              <Text className='sec-title'>我的订单</Text>
              <View
                className='more'
                onClick={this.navigateTo.bind(this, '/pages/trade/list')}
              >查看全部订单<AtIcon value='chevron-right'></AtIcon></View>
            </View>
            <View className='sec-bd'>
              <View className='member-trades__menus'>
                <AtBadge>
                  <SpIconMenu
                    icon='pay'
                    title='全部'
                    to='/pages/trade/list?status=0'
                  />
                </AtBadge>
                <AtBadge value={ordersCount.normal_payed_notdelivery}>
                  <SpIconMenu
                    icon='clock'
                    title='待发货'
                    to='/pages/trade/list?status=1'
                  />
                </AtBadge>
                <AtBadge value={ordersCount.normal_payed_delivered}>
                  <SpIconMenu
                    icon='baoguo'
                    title='待收货'
                    to='/pages/trade/list?status=2'
                  />
                </AtBadge>
                <AtBadge>
                  <SpIconMenu
                    icon='comment'
                    title='已完成'
                    to='/pages/trade/list?status=3'
                  />
                </AtBadge>
              </View>
            </View>
          </View>
        </View>

        <View className='member-sec member-tools'>
          <View className='sec-hd'>
            <Text className='sec-title'>必备工具 </Text>
          </View>
          <View className='sec-bd'>
            <View className='member-tools__menus'>
              <View className='member-tools__item'>
                <SpIconMenu
                  icon='star'
                  title='我的收藏'
                  to='/pages/member/favorite'
                />
              </View>
              <View className='member-tools__item'>
                <SpIconMenu
                  icon='thumb'
                  title='推广管理'
                  to='/pages/member/recommend'
                />
              </View>
              <View className='member-tools__item'>
                <SpIconMenu
                  icon='hongbao'
                  title='充值'
                  to='/pages/member/pay'
                />
              </View>
              <View className='member-tools__item'>
                <SpIconMenu
                  icon='money'
                  title='积分充值'
                  to='/pages/member/money-to-point'
                />
              </View>
              <View className='member-tools__item'>
                <SpIconMenu
                  icon='location'
                  title='收货地址'
                  to='/pages/member/address'
                />
              </View>
              <View className='member-tools__item'>
                <SpIconMenu
                  icon='qrcode'
                  title='积分商城'
                  to='/pages/item/point-list'
                />
              </View>
              <View className='member-tools__item'>
                <SpIconMenu
                  icon='money'
                  title='我的资金'
                  to='/pages/member/recharge'
                />
              </View>
              <View className='member-tools__item'>
                <SpIconMenu
                  icon='help'
                  title='积分抽奖'
                  to='/pages/member/point-draw'
                />
              </View>
            </View>
          </View>
        </View>

        <TabBar
          current={3}
        />
      </View>
    )
  }
}
