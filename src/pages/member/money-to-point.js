
import Taro, { Component } from '@tarojs/taro'
import {View, Text } from '@tarojs/components'
import {AtButton, AtInput, AtModal} from 'taro-ui'
import api from '@/api'
import { SpToast, NavBar } from '@/components'
import S from '@/spx'

import './money-to-point.scss'

export default class MoneyToPoint extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      otherNumber: '',
      isOpened: false,
      totalPoint: 0
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { point } = await api.member.pointTotal()
    this.setState({
      totalPoint: point
    })
  }

 

  handleChangeOtherNum = (val) => {
    this.setState({
      otherNumber: val
    })
  }
  handleClosePay = () => {
    this.setState({
      isOpened: false
    })
  }
  handleConfirmPay = async () => {
    const query = {
      money: this.state.otherNumber
    }
    try {
      await api.member.depositToPoint(query)
        .then(() => {
          this.setState({
            isOpened: false,
            otherNumber: ''
          })
          Taro.showToast({
            title: '兑换成功',
            icon: 'none',
          }).then(() => {
            setTimeout(()=>{
              this.fetch()
            }, 1000)

          })
        })
    } catch (error) {
      S.toast(`${error.res.data.error.message}`)
      return false
    }
  }
  handleClickPay = (val) => {
    if(val <= 0) {
      return S.toast('请输入大于0的金额')
    }
    this.setState({
      isOpened: true,
      otherNumber: val
    })
  }

  render () {
    const { otherNumber, isOpened, totalPoint } = this.state

    return (
      <View className='page-member-integral'>
        <NavBar
          title='积分充值'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='member-integral__hd'>
          <View className='integral-info'>
            <View className='integral-number'>
              <Text className='sp-icon sp-icon-jifen1 icon-point'> </Text>
              <Text className='integral-number__text'>{totalPoint}</Text>
            </View>
            <View className='integral-text'>当前积分余额</View>
          </View>
        </View>

        <View className='member-integral__bd'>
          <View className='integral-sec integral-info__status'>
            <View className='integral-sec__share'>点击“立即兑换”即表示阅读并同意<Text>《兑换协议》</Text></View>
          </View>
          <View className='integral-sec member-pay'>
            <AtInput className='otherNumber' title='兑换金额' name='otherNumber' type='number' value={otherNumber} placeholder='请输入金额' onChange={this.handleChangeOtherNum} />

            <View className='btns'>
              <AtButton type='primary' onClick={this.handleClickPay.bind(this, otherNumber)}>立即兑换</AtButton>
            </View>
          </View>
          <AtModal
            isOpened={isOpened}
            cancelText='取消'
            confirmText='确认'
            onClose={this.handleClosePay}
            onCancel={this.handleClosePay}
            onConfirm={this.handleConfirmPay}
            content={`请确认是否将${otherNumber}元兑换成积分`}
          />
        </View>
        <SpToast />

      </View>
    )
  }
}
