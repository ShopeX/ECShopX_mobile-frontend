/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 翻牌助力
 * @FilePath: /unite-vshop/src/boost/pages/flop/index.js
 * @Date: 2020-09-23 16:49:53
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-24 15:55:20
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Progress, Text, Button } from '@tarojs/components'
import { pickBy } from '@/utils'
import api from '@/api'
import './index.scss'

export default class Flop extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.getBoostDetail()
  }

  // 获取助力详情wechat-taroturntable
  getBoostDetail = async () => {
    Taro.showLoading({mask: true})
    const { bargain_id } = this.$router.params
    const {
      bargain_info = {},
      user_bargain_info = {},
      bargain_order = {},
      bargain_log = {},
      user_info = {}
    } = await api.boost.getUserBargain({
      bargain_id,
      has_order: true
    })

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
      orderInfo: bargain_order,
      boostList: bargain_log.list || [],
      userInfo: user_info,
      isJoin: !!user_bargain_info.user_id,
    }, () => {
      Taro.hideLoading()
    })
  }  

  render () {
    const { info, boostList, isDisabled } = this.state
    return (
      <View className='flop'>
        <View className='goods'>
          <Image className='img' src={info.item_pics} mode='aspectFill' />
          <View className='info'>
            <View className='title'>{ info.item_name }</View>
            <View className='progress'>
              <Progress percent={20} activeColor='#a2564c' backgroundColor='#f0eeed' strokeWidth={6} active />
              <View className='interval'>
                <Text className='text'>¥{ info.mkt_price }</Text>
                <Text className='text'>¥{ info.price }</Text>
              </View>
            </View>
          </View>
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
          // onClick={this.handleSubmit.bind(this)}
        >
          我也要参加
        </Button>               
      </View>
    )
  }  
}