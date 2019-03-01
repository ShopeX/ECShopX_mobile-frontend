
import Taro, { Component } from '@tarojs/taro'
import {View, Text } from '@tarojs/components'
import {AtButton, AtTag, AtInput} from 'taro-ui'
import { Loading } from '@/components'
import { withPager } from '@/hocs'
import api from '@/api'
import { pickBy, classNames } from '@/utils'

import './pay.scss'

@withPager
export default class Integral extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      isLoading: false,
      isActiveName: '',
      otherNumberStatus: false,
    }
  }

  componentDidMount () {
    this.setState(() => {
      this.nextPage()
    })
  }

  async fetch () {
    // const { page_no: page, page_size: pageSize } = params

    const { list, total_count: total } = await api.member.getRechargeNumber()
    let nList = pickBy(list, {
      money: 'money',
      ruleData: 'ruleData',
      ruleType: 'ruleType',
    })
    nList.push({
      money: '其他金额',
      ruleData: '',
      ruleType: 'ruleType',
    })
    this.setState({
      list: [...this.state.list, ...nList],
    })
    console.log(nList, 54)
    return {
      total
    }
  }

  handleClickTag = (ruleData, obj) => {
    console.log(ruleData, obj)
    this.setState({
      isActiveName: obj.name,
      ruleData: ruleData
    })
    if(obj.name === '其他金额') {
      this.setState({
        otherNumberStatus: true,
      })
    }else {
      this.setState({
        otherNumberStatus: false,
      })
    }
  }

  handleChangeOtherNum = (val) => {
    console.log(val)
    this.setState({
      otherNumber: val,
      isActiveName: val
    })
  }

  handleClickPay = () => {
    console.log(this.state.isActiveName, "提交")
    // Taro.navigateTo({
    //   url: '/pages/cart/checkout'
    // })
  }

  render () {
    const { list, isActiveName, otherNumber, otherNumberStatus, ruleData, page } = this.state

    return (
      <View className='page-member-integral'>
        <View className='member-integral__hd'>
          <View className='integral-info'>
            <View className='integral-number'>图标<Text className='integral-number__text'>1888</Text></View>
            <View className='integral-text'>当前账户余额</View>
          </View>
        </View>

        <View className='member-integral__bd'>
          <View className='integral-sec integral-info__status'>
            <View className='integral-sec__share'>点击“立即充值”即表示阅读并同意<Text>《充值协议》</Text></View>
          </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : <View className='integral-sec member-pay'>
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
                                onClick={this.handleClickTag.bind(this, item.ruleData)}
                              >
                                {item.money}
                              </AtTag>
                            )
                          })
                        }
                        {
                          ruleData > 0
                            ? <View className='extra-regard'>额外奖励：<Text className='extra-regard__Text'>充值{isActiveName}送{ruleData}</Text></View>
                            : null
                        }
                      </View>
                      : null
                  }
                  {
                    otherNumberStatus
                      ? <AtInput className='otherNumber' title='其他金额' name='otherNumber' value={otherNumber} placeholder='请输入金额' onChange={this.handleChangeOtherNum} />
                      : null
                  }
                  <View className='btns'>
                    <AtButton type='primary' onClick={this.handleClickPay}>立即充值</AtButton>
                  </View>
                </View>
          }

        </View>
      </View>
    )
  }
}
