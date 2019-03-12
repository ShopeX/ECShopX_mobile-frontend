import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtBadge, AtIcon, AtAvatar } from 'taro-ui'
import { SpIconMenu, TabBar } from '@/components'
import { withLogin } from '@/hocs'

import './recommend.scss'

@withLogin()
export default class Recommend extends Component {
  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  componentDidShow () {
  }

  render () {
    return (
      <View className='page-member-index'>
        <View className='member-index__hd'>
          <View className='member-info_top'>
            <AtAvatar
              className='member-avatar'
              title='鲜果优格果冻妹'
              size='large'
              circle
            />
            <View className='member-info_name'>
              <View className='member-name'>推荐人：</View>
              <View className='member-name'>18855555555</View>
            </View>
          </View>
        </View>

        <View className='member-index__bd'>
          <View className='member-sec member-info__status'>
            <View className='member-status__item'>
              <View className='member-status__item-val'>666<Text>元</Text></View>
              <Text className='member-status__item-title'>营业额</Text>
            </View>
            <View className='member-status__item'>
              <View className='member-status__item-val'>666<Text>元</Text></View>
              <Text className='member-status__item-title'>可提现</Text>
            </View>
          </View>

          <View className='member-sec member-trades'>
            <View className='sec-hd'>
              <Text className='sec-title'>我的会员</Text>
              <View
                className='more'
                onClick={this.navigateTo.bind(this, '/pages/trade/list')}
              >查看全部订单<AtIcon value='chevron-right'></AtIcon></View>
            </View>
            <View className='sec-bd'>
              <View className='member-trades__menus'>
                <AtBadge value={3}>
                  <SpIconMenu
                    icon='pay'
                    title='待付款'
                    to='/pages/trade/list?status=WAIT_BUYER_PAY'
                  />
                </AtBadge>
                <AtBadge value={13}>
                  <SpIconMenu
                    icon='clock'
                    title='待发货'
                    to='/pages/trade/list?status=WAIT_SELLER_SEND_GOODS'
                  />
                </AtBadge>
                <AtBadge value={13}>
                  <SpIconMenu
                    icon='baoguo'
                    title='待收货'
                    to='/pages/trade/list?status=WAIT_BUYER_CONFIRM_GOODS'
                  />
                </AtBadge>
                <AtBadge>
                  <SpIconMenu
                    icon='comment'
                    title='待评论'
                    to='/pages/trade/list?status=WAIT_RATE'
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
              <View class='member-tools__item'>
                <SpIconMenu
                  icon='star'
                  title='我的收藏'
                  to='/pages/member/favorite'
                />
              </View>
              <View class='member-tools__item'>
                <SpIconMenu
                  icon='thumb'
                  title='我的推荐'
                />
              </View>
              <View class='member-tools__item'>
                <SpIconMenu
                  icon='hongbao'
                  title='我的红包'
                />
              </View>
              <View class='member-tools__item'>
                <SpIconMenu
                  icon='money'
                  title='我的资金'
                />
              </View>
              <View class='member-tools__item'>
                <SpIconMenu
                  icon='location'
                  title='收货地址'
                  to='/pages/member/address'
                />
              </View>
              <View class='member-tools__item'>
                <SpIconMenu
                  icon='qrcode'
                  title='推广二维码'
                />
              </View>
              <View class='member-tools__item'>
                <SpIconMenu
                  icon='setting'
                  title='设置'
                />
              </View>
              <View class='member-tools__item'>
                <SpIconMenu
                  icon='help'
                  title='使用帮助'
                />
              </View>
            </View>
          </View>
        </View>

      </View>
    )
  }
}
