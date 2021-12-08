import Taro, { Component } from '@tarojs/taro'
import { Textarea, View, Image, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { pickBy } from '@/utils'
import api from '@/api'
import { SpNavBar, AddressChoose } from '@/components'

import './index.scss'

@connect(
  ({ address }) => ({
    address: address.current
  }),
  (dispatch) => ({
    onAddressChoose: (address) => dispatch({ type: 'address/choose', payload: address })
  })
)
export default class Pay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cur_address: null,
      remark: '',
      goodInfo: {},
      purchasePrice: '0.00',
      isLoading: false
    }
  }

  componentDidMount() {
    this.getOrderInfo()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) { 
      this.handleChangeAddress(nextProps.address)
    }
  }

  config = {
    navigationBarTitleText: '结算页面'
  }

  // 处理地址
  handleChangeAddress = (address) => {
    if (!address) return false
    const formatAddress = pickBy(address, {
      state: 'province',
      city: 'city',
      district: 'county',
      address_id: 'address_id',
      mobile: 'telephone',
      name: 'username',
      zip: 'postalCode',
      address: 'adrdetail',
      area: 'area'
    })
    this.setState({
      cur_address: formatAddress
    })
  }

  // 输入备注
  remarkInput = (e) => {
    const { detail = {} } = e
    const { value = '' } = detail
    this.setState({
      remark: value
    })
  }

  // 获取数据
  getOrderInfo = async () => {
    const { bargain_id } = this.$router.params
    const { bargain_info = {}, user_bargain_info = {} } = await api.boost.getUserBargain({
      bargain_id,
      has_order: true
    })
    const { mkt_price: mPrice, price } = bargain_info
    const { user_id, cutdown_amount } = user_bargain_info
    let purchasePrice = mPrice
    const discount = mPrice - price
    if (user_id && discount > cutdown_amount) {
      purchasePrice = mPrice - cutdown_amount
    }
    const { list = [] } = await api.member.addressList()
    this.setState(
      {
        goodInfo: pickBy(bargain_info, {
          bargain_id: 'bargain_id',
          item_name: 'item_name',
          item_pics: 'item_pics',
          item_intro: 'item_intro',
          bargain_rules: 'bargain_rules',
          share_msg: 'share_msg',
          mkt_price: ({ mkt_price }) => (mkt_price / 100).toFixed(2)
        }),
        purchasePrice: (purchasePrice / 100).toFixed(2)
      },
      () => {
        // 设置默认地址
        let defaultAddress = null
        if (list && list.length > 0) {
          const isDef = list.find((item) => item.is_def)
          defaultAddress = isDef
        }
        this.props.onAddressChoose(defaultAddress)
      }
    )
  }

  // 支付
  handlePay = async () => {
    const { cur_address, goodInfo, remark } = this.state
    if (!cur_address) {
      Taro.showToast({
        title: '请选择地址',
        icon: 'none',
        mask: true
      })
      return false
    }
    // loading
    this.setState({
      isLoading: true
    })
    const receiver = pickBy(cur_address, {
      receiver_name: 'name',
      receiver_mobile: 'mobile',
      receiver_state: 'state',
      receiver_city: 'city',
      receiver_district: 'district',
      receiver_address: 'address',
      receiver_zip: 'zip'
    })
    const param = {
      order_type: 'bargain',
      bargain_id: goodInfo.bargain_id,
      item_num: 1,
      remark,
      ...receiver
    }
    let jumpUrl = `/boost/pages/payDetail/index?bargain_id=${goodInfo.bargain_id}`
    try {
      const res = await api.boost.pay(param)
      if (res.appId) {
        await Taro.requestPayment(res)
        Taro.showToast({
          title: '支付成功',
          mask: true
        })
        jumpUrl += `&order_id=${res.trade_info.order_id}`
      }
    } catch (e) {
      if (!e.res) {
        let errMsg = '支付失败'
        if (e.errMsg === 'requestPayment:fail cancel') {
          errMsg = '取消支付'
        }
        Taro.showToast({
          title: errMsg,
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    }
    this.setState({
      isLoading: false
    })
    Taro.redirectTo({
      url: jumpUrl
    })
  }

  render() {
    const { cur_address, remark, goodInfo, purchasePrice, isLoading } = this.state
    return (
      <View className='pay'>
        <SpNavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <AddressChoose isAddress={cur_address} />
        <View className='remark'>
          <View className='title'>备注</View>
          <Textarea
            style='width:100%;min-height: 50px'
            placeholder='例如颜色尺寸等'
            value={remark}
            onInput={this.remarkInput.bind(this)}
            autoHeight
          />
        </View>
        <View className='goods'>
          <Image src={goodInfo.item_pics} mode='aspectFill' className='img' />
          <View className='info'>
            <View className='name'>{goodInfo.item_name}</View>
            <View className='price'>
              <Text>¥{goodInfo.mkt_price}/件</Text>
              <Text>x1</Text>
            </View>
          </View>
        </View>
        <View className='sum'>
          商品总价<Text>¥{purchasePrice}</Text>
        </View>
        <View className='actBtn'>
          <View className='price'>
            实付款: <Text>¥{purchasePrice}</Text>
          </View>
          <Button
            className='btn'
            disabled={isLoading}
            loading={isLoading}
            onClick={this.handlePay.bind(this)}
          >
            立即付款
          </Button>
        </View>
      </View>
    )
  }
}
