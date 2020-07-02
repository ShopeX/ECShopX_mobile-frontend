/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 充值余额
 * @FilePath: /vshop/src/pages/member/recharge.js
 * @Date: 2020-01-13 17:38:42
 * @LastEditors: Arvin
 * @LastEditTime: 2020-03-19 15:09:40
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input } from '@tarojs/components'
import { NavBar } from '@/components'
import { connect } from '@tarojs/redux'
import { withLogin, withRedirectUrl } from '@/hocs'
import { classNames } from '@/utils'
import api from '../../api/index'
// import InputNumber from '@/components/input-number'
// import api from '@/api'
import './recharge.scss'

@connect(({ address }) => ({
  address: address.current
}))

@withLogin()

@withRedirectUrl

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
      deposit: 0 ,
      recharge_rule_id: ''     
    }
  }

  componentWillMount () {

  }

  componentDidMount () {
    // 获取充值金额列表
    api.member.getRechargeNumber().then(res => {
      const { deposit = 0 } = this.$router.params
      const amounts = res.list
      amounts.push({
        money: '其他金额'
      })
      this.setState({
        deposit,
        amounts
      })
    })    
  }

  componentDidShow () {
    this.setStore()
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
      Taro.navigateTo({url: '../store/list'})
    }
  }

  // 选择金额
  handleClickItem = (index, value) => {
    const { amounts } = this.state
    let setValue = ''
    let ruleValue = ''
    let rule_id = ''
    // 判断是否点击其他金额
    if (index !== (amounts.length - 1)) {
      setValue = value.money
      rule_id = value.id
      ruleValue = value.ruleType && value.ruleType === 'money' && value.ruleData > 0 ? `充值${ value.money }元送${ value.ruleData }元` : ''
    }
    this.setState({
      active: index,
      value: setValue,
      ruleValue,
      recharge_rule_id: rule_id
    })
  }

  // 输入其他金额
  handleQuantityChange = ({detail}) => {
    const { value } = detail
    this.setState({
      value
    })

    return value
  }

  // 支付
  recharge = () => {
    const { recharge_rule_id, currentShop, value } = this.state
    console.log(currentShop)
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
      totalFee: value * 100,
      member_card_code: '',
      body: `${store_name}充值`,
      detail: '充值'
    }
    // 请求
    console.log(param)
    api.member.rehcargePay(param).then(res => {
      console.log(res)
    })
  }

  // 微信支付
  weappPay = (param) => {
    Taro.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success: () => {},
      fail: () => {}
    })
  }

  // H5支付
  h5Pay = (param) => {

  }

  render () {
    const { currentShop, deposit, amounts, active, value, ruleValue } = this.state
    const amountLength = (amounts.length - 1)
    return (
      <View className='recharge'>
        {/* NavBar */}
        <NavBar title='充值' leftIconType='chevron-left' />
        {/* 当前门店 */}
        {
          currentShop && <View className='shopName' onClick={this.setStore.bind(this, true)}>
            当前门店: { currentShop.name }
          </View>
        }
        {/* 余额 */}
        <View className='balance'>
          <Image className='balanceImg' src={require('../../assets/imgs/buy.png')}></Image>
          <View className='content'>
            <View className='balancePrice'>¥{ deposit / 100}</View>
            <View className='balanceTip'>卡内余额</View>
          </View>
        </View>
        {/* 充值协议 */}
        <View className='balancePro'>
          <View className='price'>充值金额</View>
          <View className='pro'>
            点击“立即充值”即表示阅读并同意
            《<Text className='proText'>充值协议</Text>》
          </View>
        </View>
        <View className='main'>
          <View className='priceList'>
            {
              amounts.map((item, index)=> (
                <View
                  key={item.money}
                  className={classNames('default', {'primary': index === active})}
                  onClick={this.handleClickItem.bind(this, index, item)}
                >
                  { index !== amountLength ? `${item.money}元` : item.money }
                </View>
              ))
            }
          </View>
          {/* 输入其他金额 */}
          {
            active === amountLength && <View>
              <Input
                className='priceInput'
                min={1}
                // max={maxStore}
                type='number'
                placeholder='请输入金额'
                value={value}
                onChange={this.handleQuantityChange.bind(this)}
              />
            </View>
          }
          {/* 额外奖励 */}
          {
            ruleValue && <View className='ruleValue'>
              额外奖励: <Text className='text'>{ ruleValue }</Text>
            </View>
          }
          <View className='submit' onClick={this.recharge.bind(this)}>立即充值</View>
        </View>
      </View>
    )
  }
}