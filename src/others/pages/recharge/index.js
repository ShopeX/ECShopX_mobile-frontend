import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text, Input } from '@tarojs/components'
import { SpNavBar, SpCell } from '@/components'
import { connect } from 'react-redux'
import { withLogin } from '@/hocs'
import S from '@/spx'
import { classNames } from '@/utils'
import api from '@/api'
import PaymentPicker from '../../../pages/cart/comps/payment-picker'
// /Users/zhangqing/projectTwo/ecshopx-vshop/src/pages/cart/comps/payment-picker.js
import './index.scss'

@connect(({ user, colors, sys }) => ({
  address: user.address,
  colors: colors.current,
  pointName: sys.pointName
}))
@withLogin()
export default class Recharge extends Component {
  constructor (props) {
    super(props)
    /**
     * @description: state字段说明
     * @param {
     *  active: '选择下标',
     *  value: '充值金额',
     *  amounts: '可选择充值金额列表',
     *  currentShop: '当前店铺',
     *  ruleValue: '额外赠送说明',
     *  deposit: '剩余金额',
     *  recharge_rule_id: '规则ID'
     * }
     */
    this.state = {
      active: '',
      value: '',
      amounts: [],
      currentShop: {},
      ruleValue: '',
      deposit: 0,
      recharge_rule_id: '',
      payType: '',
      isPaymentOpend: false
    }
  }

  componentDidMount () {
    this.getMemberInfo()
    // 获取充值金额列表
    api.member.getRechargeNumber().then((res) => {
      const amounts = res.list
      amounts.push({
        money: '其他金额'
      })
      this.setState({
        amounts
      })
    })
  }

  componentDidShow () {
    this.setStore()
  }

  // 获取会员详情
  getMemberInfo () {
    api.member.memberInfo().then((res) => {
      this.setState({
        deposit: res.deposit
      })
    })
  }
  // 设置门店
  setStore = (isChange = false) => {
    const store = Taro.getStorageSync('curStore')
    if (store && !isChange) {
      this.setState({
        currentShop: {
          name: store.name || store.store_name,
          shop_id: store.shop_id,
          store_name: store.store_name,
          poiid: store.poiid
        }
      })
    } else {
      Taro.navigateTo({ url: '/pages/store/list' })
    }
  }

  // 选择金额
  handleClickItem = (index, value) => {
    const { amounts } = this.state
    let setValue = ''
    let ruleValue = ''
    let rule_id = ''
    // 判断是否点击其他金额
    if (index !== amounts.length - 1) {
      const sendType = value.ruleType === 'money' ? '元' : this.props.pointName
      setValue = value.money
      rule_id = value.id
      ruleValue =
        value.ruleType && value.ruleData > 0
          ? `充值${value.money}元送${value.ruleData}${sendType}`
          : ''
    }
    this.setState({
      active: index,
      value: setValue,
      ruleValue,
      recharge_rule_id: rule_id
    })
  }

  // 输入其他金额
  handleQuantityChange = ({ detail }) => {
    const { value } = detail
    this.setState({
      value
    })
    return value
  }

  // 支付
  recharge = () => {
    if (!S.getAuthToken()) {
      return S.toast('请先登录')
    }
    // const userInfo = Taro.getStorageSync('userinfo')
    const { recharge_rule_id, currentShop, value, payType } = this.state
    const { poiid = '', shop_id = '', store_name = '' } = currentShop
    // 判断充值金额
    if (!value) {
      Taro.showToast({
        title: '请输入充值金额',
        icon: 'none'
      })
      return false
    }
    // 请求参数
    const param = {
      poiid,
      shop_id,
      shop_name: store_name,
      recharge_rule_id,
      total_fee: Number(value) * 100,
      member_card_code: '',
      body: `${store_name}充值`,
      detail: '充值',
      pay_type: payType
    }
    // 请求
    Taro.showLoading({
      title: '拉起支付...',
      mask: true
    })
    api.member
      .rehcargePay(param)
      .then((res) => {
        Taro.hideLoading()
        if (Taro.getEnv() === 'WEAPP') {
          this.weappPay(res)
        } else {
          this.h5Pay('测试')
        }
      })
      .catch(() => {
        Taro.hideLoading()
      })
  }

  // 微信支付
  weappPay = (param) => {
    Taro.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: () => {
        Taro.showModal({
          content: '支付成功',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              this.getMemberInfo()
            }
          }
        })
      },
      fail: () => {
        Taro.showModal({
          content: '支付失败',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              this.getMemberInfo()
            }
          }
        })
      }
    })
  }

  // 前往充值协议
  toRule = () => {
    Taro.navigateTo({
      url: '/subpage/pages/auth/reg-rule?type=1'
    })
  }
  handleLayoutClose = () => {
    this.setState({
      isPaymentOpend: false
    })
  }
  handlePaymentChange = async (payType) => {
    this.setState(
      {
        payType,
        isPaymentOpend: false
      },
      () => {}
    )
  }
  handlePaymentShow = () => {
    this.setState({
      isPaymentOpend: true
    })
  }
  // 前往记录
  toHistory = (type) => {
    Taro.navigateTo({
      url: `/others/pages/recharge/history?type=${type}`
    })
  }

  // H5支付
  h5Pay = (param) => {
    console.log(param)
    Taro.showToast({
      title: 'H5支付'
    })
  }

  render () {
    const { currentShop, deposit, amounts, active, value, ruleValue, payType, isPaymentOpend } =
      this.state
    const { colors } = this.props
    const amountLength = amounts.length - 1
    const payTypeText = {
      point: `${this.props.pointName}支付`,
      wxpay: process.env.TARO_ENV === 'weapp' ? '微信支付' : '现金支付',
      deposit: '余额支付',
      delivery: '货到付款',
      hfpay: '微信支付'
    }
    return (
      <View className='recharge'>
        <SpNavBar title={this.config.navigationBarTitleText} leftIconType='chevron-left' />
        {/* 当前门店 */}
        {currentShop && (
          <View className='shopName' onClick={this.setStore.bind(this, true)}>
            当前门店: {currentShop.name}
          </View>
        )}
        {/* 余额 */}
        <View className='balance'>
          <Image className='balanceImg' src={require('../../../assets/imgs/buy.png')}></Image>
          <View className='content'>
            <View className='balancePrice'>¥{deposit / 100}</View>
            <View className='balanceTip'>卡内余额</View>
          </View>
        </View>
        <SpCell title='充值记录' isLink onClick={this.toHistory.bind(this, 0)}></SpCell>
        <SpCell title='消费记录' isLink onClick={this.toHistory.bind(this, 1)}></SpCell>
        <SpCell isLink border={false} title='支付方式' onClick={this.handlePaymentShow}>
          <Text>{payTypeText[payType]}</Text>
        </SpCell>
        <PaymentPicker
          isOpened={isPaymentOpend}
          type={payType}
          isShowPoint={false}
          isShowBalance={false}
          isShowDelivery={false}
          // disabledPayment={disabledPayment}
          onClose={this.handleLayoutClose}
          onChange={this.handlePaymentChange}
        ></PaymentPicker>
        {/* 充值协议 */}
        <View className='balancePro'>
          <View className='price'>充值金额</View>
          <View className='pro'>
            点击“立即充值”即表示阅读并同意 《
            <Text className='proText' onClick={this.toRule.bind(this)}>
              充值协议
            </Text>
            》
          </View>
        </View>
        <View className='main'>
          <View className='priceList'>
            {amounts.map((item, index) => (
              <View
                key={item.money}
                className={classNames('default', { primary: index === active })}
                style={`background: ${index === active ? colors.data[0].primary : '#efefef'}`}
                onClick={this.handleClickItem.bind(this, index, item)}
              >
                {index !== amountLength ? `${item.money}元` : item.money}
              </View>
            ))}
          </View>
          {/* 输入其他金额 */}
          {active === amountLength && (
            <View>
              <Input
                className='priceInput'
                min={1}
                // max={maxStore}
                type='number'
                placeholder='请输入金额'
                value={value}
                onInput={this.handleQuantityChange.bind(this)}
              />
            </View>
          )}
          {/* 额外奖励 */}
          {ruleValue && (
            <View className='ruleValue'>
              额外奖励: <Text className='text'>{ruleValue}</Text>
            </View>
          )}
          <View
            className='submit'
            style={`background: ${colors.data[0].primary}`}
            onClick={this.recharge.bind(this)}
          >
            立即充值
          </View>
        </View>
      </View>
    )
  }
}
