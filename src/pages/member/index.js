import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtBadge, AtIcon, AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { SpIconMenu, TabBar, SpToast } from '@/components'
import { withLogin } from '@/hocs'
import api from '@/api'
import S from '@/spx'

import './index.scss'

@connect(() => ({
}), (dispatch) => ({
  onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
}))
@withLogin()
export default class MemberIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ordersCount: {
        normal_payed_daifahuo: '',
        normal_payed_daishouhuo: ''
      },
      info: {
        deposit: '',
        point: '',
        coupon: '',
        luckdraw: '',
        username: '',
      }
    }
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    let resUser = null
    if(Taro.getStorageSync('userinfo')){
      resUser = Taro.getStorageSync('userinfo')
      this.setState({
        info: {
          username: resUser.username,
          avatar: resUser.avatar,
        }
      })
    }
    const [res, { list: favs }] = await Promise.all([api.member.memberInfo(), api.member.favsList()])
    this.props.onFetchFavs(favs)
    const userObj = {
      username: res.memberInfo.username,
      avatar: res.memberInfo.avatar,
    }
    if(!resUser || resUser.username !== userObj.username || resUser.avatar !== userObj.avatar) {
      Taro.setStorageSync('userinfo', userObj)
      this.setState({
        info: {
          username: res.memberInfo.username,
          avatar: res.memberInfo.avatar,
        }
      })
    }
  }

  handleClickRecommend = async () => {
    const { info } = this.state
    if (!info.is_open_popularize) {
      S.toast('未开启推广')
      return
    }

    if (info.is_open_popularize && !info.is_promoter) {
      await api.member.promoter()
    }

    Taro.navigateTo({
      url: '/pages/member/recommend'
    })
  }

  handleClickApp = () => {
    console.log('跳转统合小程序')
  }

  render () {
    const { ordersCount, info } = this.state
    let isAvatatImg
    if(info.avatar) {
      isAvatatImg = true
    }

    return (
      <View className='page-member-index'>
        <View className='member-card'>
          {/*<View className='member-welcome'>
            <View className='in-icon in-icon-make-up' />
          </View>*/}
          <View
            className='member-info'
            onClick={this.navigateTo.bind(this, '/pages/member/setting')}
          >
            <AtAvatar
              className='member-avatar'
              title={info.username}
              image={isAvatatImg ? info.avatar : ''}
              text={isAvatatImg ? '' : info.username}
              size='large'
              circle
            />
            <View className='member-name'>{info.username}</View>
          </View>
          <View className='member-btns'>
            <View className='member-btn__item'>
              <View className='in-icon in-icon-check' />
              <Text>Welcome</Text>
            </View>
            <View className='member-btn__item'>
              <View
                className='in-icon in-icon-home-th'
                onClick={this.handleClickApp}
              ></View>
            </View>
            <View className='member-btn__item'>
              <View className='in-icon in-icon-coin' />
              <Text>我的积分</Text>
            </View>
          </View>
        </View>

        <View className='member-index__bd'>
          <View className='member-menu__item'>
            <SpIconMenu
              size='28'
              icon='coupon'
              iconPrefixClass='in-icon'
              title='优惠券'
              to='/pages/member/coupon'
            />
          </View>
          <View className='member-menu__item'>
            <SpIconMenu
              size='28'
              icon='gift'
              iconPrefixClass='in-icon'
              title='我要送礼'
              to='new-mini'
            />
          </View>
          <View className='member-menu__item none-br'>
            <SpIconMenu
              size='28'
              icon='clock'
              iconPrefixClass='in-icon'
              title='浏览记录'
              to='/pages/member/item-history'
            />
          </View>
          <View className='member-menu__item'>
            <SpIconMenu
              size='28'
              icon='address'
              iconPrefixClass='in-icon'
              title='我的地址'
              to='/pages/member/address'
            />
          </View>
          <View className='member-menu__item'>
            <SpIconMenu
              size='28'
              icon='order'
              iconPrefixClass='in-icon'
              title='我的订单'
              to='/pages/trade/list'
            />
          </View>
          <View className='member-menu__item none-br'>
            <SpIconMenu
              size='28'
              icon='invoice'
              iconPrefixClass='in-icon'
              title='发票管理'
              to='/pages/trade/invoice-list'
            />
          </View>
          <View className='member-menu__item none-bb'>
            <SpIconMenu
              size='28'
              icon='fav'
              iconPrefixClass='in-icon'
              title='我的收藏'
              to='/pages/member/item-fav'
            />
          </View>
          <View className='member-menu__item none-bb'>
            <SpIconMenu
              size='28'
              icon='guess'
              iconPrefixClass='in-icon'
              title='猜你喜欢'
              to='/pages/member/item-guess'
            />
          </View>
          <View className='member-menu__item none-bb none-br'>
            <SpIconMenu
              size='28'
              icon='kefu'
              iconPrefixClass='in-icon'
              openType='contact'
              title='联系客服'
            />
          </View>
        </View>

        <TabBar
          current={4}
        />
      </View>
    )
  }
}
