import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtBadge, AtIcon, AtAvatar } from 'taro-ui'
import { SpIconMenu, NavBar } from '@/components'
import { pickBy } from '@/utils'
import api from '@/api'
import { withLogin } from '@/hocs'
import ShareQrcode from './comps/share-qrcode'

import './recommend.scss'

@withLogin()
export default class Recommend extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      info: {},
      detail: {},
      isOpened: false,
    }
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }
  componentDidMount () {
    this.fetch()
  }


  async fetch () {
    await api.member.recommendUserInfo()
      .then(res => {
        const nList = pickBy(res, {
          username: 'username',
          promoter_grade_name: 'promoter_grade_name',
          parent_info: 'parent_info.username',
          headimgurl: 'headimgurl',
          mobile: 'mobile'
        })
        this.setState({
          info: nList,
        })
      })

    await api.member.recommendIndexInfo()
      .then(res => {
        const nList = pickBy(res, {
          itemTotalPrice: ({ itemTotalPrice }) => (itemTotalPrice/100).toFixed(2),
          cashWithdrawalRebate: ({ cashWithdrawalRebate }) => (cashWithdrawalRebate/100).toFixed(2),
          promoter_order_count: 'promoter_order_count',
          promoter_grade_order_count: 'promoter_grade_order_count',
          isbuy_promoter: 'isbuy_promoter',
          notbuy_promoter: 'notbuy_promoter',
        })
        this.setState({
          detail: nList,
        })
      })
  }

  handleClickQrcode = async () => {

    if(Taro.getEnv() === 'WEAPP') {
      await api.member.qrcodeData()
        .then(res => {
          Taro.previewImage({
            current: res.qrcode,
            urls: [res.qrcode]
          })
        })
      console.log(1)
    } else {
      this.setState({
        isOpened: true
      })
      // await api.member.h5_qrcodeData()
      //   .then(res => {
      //
      //     Taro.previewImage({
      //       current: res.share_qrcode,
      //       urls: [res.share_qrcode]
      //     })
      //   })
      // console.log(2)
    }
  }


  render () {
    const { info, detail, isOpened } = this.state

    return (
      <View className='page-member-index'>
        <NavBar
          title='我的推广'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='member-index__hd'>
          <View className='member-info_top'>
            {
              info.parent_info ? <AtAvatar className='member-avatar' title='头像' size='large' circle /> : null
            }

            <View className='member-info_name'>
              <View>{info.username}({info.promoter_grade_name})</View>
              <View>{info.mobile}</View>
              {
                info.parent_info ? <View className='member-name'>推荐人：{info.parent_info}</View> : null
              }
            </View>
          </View>
        </View>
        <View className='member-index__bd'>
          <View className='member-sec member-info__status'>
            <View className='member-status__item'>
              <View className='member-status__item-val'>{detail.itemTotalPrice}<Text>元</Text></View>
              <Text className='member-status__item-title'>营业额</Text>
            </View>
            <View className='member-status__item'>
              <View className='member-status__item-val'>{detail.cashWithdrawalRebate}<Text>元</Text></View>
              <Text className='member-status__item-title'>可提现</Text>
            </View>
          </View>
          <View className='member-sec member-trades'>
            <View className='sec-bd'>
              <View className='member-recommend__menus'>
                <AtBadge
                  value={detail.promoter_order_count}
                >
                  <SpIconMenu
                    icon='dingdan1'
                    title='提成订单'
                    to='/pages/member/recommend-order?brokerage_source=order'
                  />
                </AtBadge>
                <AtBadge
                  value={detail.promoter_grade_order_count}
                >
                  <SpIconMenu
                    icon='dingdan1'
                    title='津贴订单'
                    to='/pages/member/recommend-order?brokerage_source=order_team'
                  />
                </AtBadge>
              </View>
            </View>
          </View>

          <View className='member-sec member-trades' onClick={this.navigateTo.bind(this, '/pages/member/recommend-member')}>
            <View className='sec-hd'>
              <Text className='sec-title'>我的会员</Text>
              <View
                className='more'
                // onClick={this.navigateTo.bind(this, '/pages/trade/list')}
              ><AtIcon value='chevron-right'></AtIcon></View>
            </View>
            <View className='sec-bd'>
              <View className='member-recommend__menus'>
                <View>已购买会员<Text className='member-number'>{detail.isbuy_promoter}</Text>人</View>
                <View>未购买会员<Text className='member-number'>{detail.notbuy_promoter}</Text>人</View>
              </View>
            </View>
          </View>
        </View>

        <View className='member-sec member-tools'>
          <View className='sec-bd'>
            <View className='member-recommend__menus' onClick={this.handleClickQrcode}>
              <View className='sp-icon sp-icon-qrcode icon-qrcode'></View>
              <View>我的二维码</View>
            </View>
          </View>
        </View>

        {
          isOpened ? <ShareQrcode Opened={isOpened} /> : null
        }

      </View>
    )
  }
}
