
import Taro, { Component } from '@tarojs/taro'
import {View, Text } from '@tarojs/components'
import {AtButton, AtTag, AtInput} from 'taro-ui'
import { NavBar } from '@/components'
import { withPager } from '@/hocs'
import api from '@/api'
import { pickBy, classNames } from '@/utils'

import './pay.scss'

@withPager
export default class Pay extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      isLoading: false,
      isActiveName: '',
      totalDeposit: 0
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { list, total_count: total } = await api.member.getRechargeNumber()
    const { deposit } = await api.member.depositTotal()
    let nList = pickBy(list, {
      money: 'money',
      ruleData: 'ruleData',
      ruleType: 'ruleType',
    })
    this.setState({
      list: [...this.state.list, ...nList],
      totalDeposit: deposit
    })
    return {
      total
    }
  }

  handleClickTag = (ruleData, ruleType, obj) => {
    this.setState({
      isActiveName: obj.name,
      ruleData: ruleData,
      ruleType: ruleType,
    })
  }

  handleClickPay = async () => {
    const query = {
      total_fee: this.state.isActiveName,
    }
    Taro.showLoading({
      title: '生成订单中',
      mask: true
    });
    await api.member.depositPay(query)
      .then(res => {
        Taro.hideLoading()
        Taro.navigateTo({
          url: `/pages/cashier/index?order_id=${res.order_id}`
        })
      })
  }

  render () {
    const { list, isActiveName, ruleType, ruleData, totalDeposit } = this.state

    return (
      <View className='page-member-integral'>
        <NavBar
          title='余额充值'
          leftIconType='chevron-left'
        />
        <View className='member-integral__hd'>
          <View className='integral-info'>
            <View className='integral-number'>
              <Text className='sp-icon sp-icon-zijin icon-point'> </Text>
              <Text className='integral-number__text'>{totalDeposit}</Text>
            </View>
            <View className='integral-text'>当前账户余额</View>
          </View>
        </View>

        <View className='member-integral__bd'>
          <View className='integral-sec integral-info__status'>
            <View className='integral-sec__share'>点击“立即充值”即表示阅读并同意<Text>《充值协议》</Text></View>
          </View>
          <View className='integral-sec member-pay'>
            {
              list.length > 0
                ? <View className='member-pay__list'>
                  {
                    list.map((item, index) => {
                      return (
                        <AtTag
                          className={classNames('member-pay__list-item',  item.money === isActiveName ? 'member-pay__list-active' : null)}
                          key={index}
                          name={item.money}
                          active={item.money === isActiveName ? true : false}
                          onClick={this.handleClickTag.bind(this, item.ruleData, item.ruleType)}
                        >
                          {item.money}
                        </AtTag>
                      )
                    })
                  }
                  <View className='otherNumber'> </View>
                  <View className='otherNumber'> </View>
                  <View className='otherNumber'> </View>
                  {
                    ruleData > 0
                      ? <View className='extra-regard'>
                        额外奖励：
                        <Text className='extra-regard__Text'>
                          充值{isActiveName}元送{ruleData}{ruleType === 'point' ? '积分' : '元'}
                        </Text>
                      </View>
                      : null
                  }

                </View>
                : null
            }
            <View className='btns'>
              <AtButton type='primary' onClick={this.handleClickPay}>立即充值</AtButton>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
