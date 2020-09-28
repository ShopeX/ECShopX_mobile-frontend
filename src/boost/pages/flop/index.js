/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 翻牌助力
 * @FilePath: /unite-vshop/src/boost/pages/flop/index.js
 * @Date: 2020-09-23 16:49:53
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-28 14:33:44
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Progress, Text, Button } from '@tarojs/components'
import { pickBy } from '@/utils'
import { NavBar } from '@/components'
import api from '@/api'
import './index.scss'

export default class Flop extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      // orderInfo: {},
      boostList: [],
      // userInfo: {},
      // isJoin: false,
      isDiscount: false,
      cutPercent: 0
    }
  }

  componentDidMount () {
    this.getBoostDetail()
  }

  config = {
    navigationBarTitleText: '帮砍'
  }

  // 获取助力详情wechat-taroturntable
  getBoostDetail = async () => {
    Taro.showLoading({mask: true})
    const { bargain_id } = this.$router.params
    const {
      bargain_info = {},
      user_bargain_info = {},
      bargain_log = {},
      // user_info = {}
    } = await api.boost.getUserBargain({
      bargain_id,
      has_order: true
    })
    const { mkt_price: mPrice, price: pPrice } = bargain_info
    const { cutdown_amount } = user_bargain_info
    const cutPercent = cutdown_amount / (mPrice - pPrice)
    this.setState({
      info: pickBy(bargain_info, {
        bargain_id: 'bargain_id',
        item_name: 'item_name',
        item_pics: 'item_pics',
        item_intro: 'item_intro',
        bargain_rules: 'bargain_rules',
        share_msg: 'share_msg',
        help_pics: 'help_pics',
        mkt_price: ({ mkt_price }) => (mkt_price / 100).toFixed(2),
        price: ({ price }) => (price / 100).toFixed(2),
        isSaleOut: ({ limit_num, order_num }) => (limit_num <= order_num),
        isOver: ({ left_micro_second }) => left_micro_second <= 0,
      }),
      boostList: bargain_log.list || [],
      cutPercent
      // userInfo: user_info,
      // isJoin: !!user_bargain_info.user_id
    }, () => {
      Taro.hideLoading()
    })
  }  

  handleDiscount = async () => {
    const { info, isDiscount } = this.state
    const userInfo = Taro.getStorageSync('userinfo') || {}
    if (isDiscount) return false
    this.setState({
      isDiscount: true
    })
    Taro.showLoading({
      title: '帮砍中',
      mask: true
    })
    const param = {
      bargain_id: info.bargain_id,
      user_id: userInfo.userId,
      open_id: userInfo.openid,
      nickname: userInfo.username,
      headimgurl: userInfo.avatar
    }
    try {
      const res = await api.boost.postDiscount(param)
      const price = Math.abs(res.cutdown_num / 100).toFixed(2)
      const msg = res.cutdown_num > 0 ? `太棒了！成功助力好友` : `对不起，助力失败！增加${price}`
      Taro.showToast({
        title: msg,
        mask: true
      })
      this.getBoostDetail()
    } catch (e) {
      console.log(e.res)
    }
    this.setState({
      isDiscount: false
    })
    Taro.hideLoading()    
  }

  handleJoin = () => {
    const { info } = this.state
    if (info.isOver) {
      Taro.showToast({
        title: '活动已结束',
        icon: 'none',
        mask: true
      })
    } else {
      Taro.navigateTo({
        url: `/boost/pages/detail/index?bargain_id=${info.bargain_id}`
      })
    }
  }

  render () {
    const { info, boostList, isDisabled, cutPercent } = this.state
    return (
      <View className='flop'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='goods'>
          <Image className='img' src={info.item_pics} mode='aspectFill' />
          <View className='info'>
            <View className='title'>{ info.item_name }</View>
            <View className='progress'>
              <Progress percent={cutPercent} activeColor='#a2564c' backgroundColor='#f0eeed' strokeWidth={6} active />
              <View className='interval'>
                <Text className='text'>¥{ info.mkt_price }</Text>
                <Text className='text'>¥{ info.price }</Text>
              </View>
            </View>
          </View>
        </View>
        <View className='discount'>
          <View className='imgs'>
            <Image src={require('../../../assets/imgs/discount_random_bg.png')} mode='aspectFill' className='banners' />
            <Image src={require('../../../assets/imgs/icon_3.png')} mode='aspectFill' className='logo' />
          </View>
          <View className='tip'>
            <View>点击任意一张卡片</View>
            <View>帮助好友领取随机折扣优惠</View>
          </View>
          {
            (info.help_pics && info.help_pics.length > 0 )&& <View className='discountImg'>
              {
                info.help_pics.map((item, index) => <Image key={`${item}${index}`}  src={item} mode='aspectFill' className='img' onClick={this.handleDiscount.bind(this)} />)
              }
            </View>
          }
        </View>
        <View className='boostMain'>
          <View className='title'>好友助力榜</View>
          {
            (boostList && boostList.length > 0) ? <View className='boostList'>
              {
                boostList.map((item, index) => <View key={`${item.nickname}${index}`} className='boostItem'>
                  <View className='left'>
                    <Image src={info.headimgurl} mode='aspectFill' className='img' />
                  </View>
                  <View className='right'>
                    <View className='name'>{ item.nickname }</View>
                    <View>
                      { item.cutdown_num >= 0 ? `减掉` : '增加'}{ (item.cutdown_num / 100).toFixed(2) }
                    </View>
                  </View>
                  { item.cutdown_num < 0 && <View className='tag'>帮了倒忙</View> }
                </View>)
              }
              </View>
              :
              <View className='boostList noHelp'>暂无好友相助~
              </View>
          }                
        </View> 
        <Button
          disabled={isDisabled}
          className={`showBtn ${isDisabled && 'disabled'}`}
          onClick={this.handleJoin.bind(this)}
        >
          我也要参加
        </Button>               
      </View>
    )
  }  
}