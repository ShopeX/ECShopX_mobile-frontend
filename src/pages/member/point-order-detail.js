import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { Loading, SpCell, SpToast, Price, NavBar, AddressPicker } from '@/components'
import { classNames, pickBy, formatTime, copyText, getCurrentRoute } from '@/utils'
import { lockScreen } from '@/utils/dom'
import api from '@/api'
import OrderItem from '../trade/comps/order-item'

import './point-order-detail.scss'

export default class PointOrderDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: null,
      address: null,
      showAddressPicker: false,
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { id } = this.$router.params
    const data = await api.member.pointOrderDetail(id)
    console.log(data)
    const info = pickBy(data, {
      luckydraw_trade_id: 'luckydraw_trade_id',
      created: ({ created }) => formatTime(created, 'YYYY-MM-DD HH:mm:ss'),
      title: 'item_name',
      pic_path: 'item_pic',
      point: 'luckydraw_point',
      status_desc: 'lucky_status',
      status_img: 'lucky_status',
      address_id: 'address_id'
    })
    if(info.status_desc === 'lucky') {
      info.status_desc_name = '中奖'
      info.status_img = 'ico_wait_buyer_confirm_goods.png'
    }else if(info.status_desc === 'unlukcy'){
      info.status_desc_name = '未中奖'
      info.status_img = 'ico_wait_rate.png'
    } else {
      info.status_desc_name = '尚未开奖'
      info.status_img = 'ico_wait_seller_send_goods.png'
    }

    this.setState({
      info
    })
  }

  handleCopy = async () => {
    const { info } = this.state
    const msg = info.luckydraw_trade_id
    await copyText(msg)
  }

  async handleClickBtn (type) {
    const { info } = this.state

    if (type === 'pay') {
      Taro.navigateTo({
        url: `/pages/cashier/index?order_id=${info.tid}`
      })
      return
    }

    if (type === 'cancel') {
      Taro.navigateTo({
        url: `/pages/trade/cancel?order_id=${info.tid}`
      })
      return
    }

    if (type === 'confirm') {
      const { confirm } = await Taro.showModal({
        title: '确认收货？',
        content: ''
      })
      if (confirm) {
        await api.trade.confirm(info.tid)
        const { fullPath } = getCurrentRoute(this.$router)
        Taro.redirectTo({
          url: fullPath
        })
      }
      return
    }
  }

  toggleState (key, val) {
    console.log(key, val, 96)
    if (val === undefined) {
      val = !this.state[key]
    }

    this.setState({
      [key]: val
    })
  }

  toggleAddressPicker (isOpened) {
    if (isOpened === undefined) {
      isOpened = !this.state.showAddressPicker
    }

    lockScreen(isOpened)
    this.setState({ showAddressPicker: isOpened })
  }

  handleAddressChange = (address) => {
    if (!address) {
      this.toggleAddressPicker(true)
      return
    }

    address = pickBy(address, {
      state: 'province',
      city: 'city',
      district: 'county',
      addr_id: 'address_id',
      mobile: 'telephone',
      name: 'username',
      zip: 'postalCode',
      address: 'adrdetail',
      area: 'area'
    })

    this.setState({
      address,
      info: {
        ...this.state.info,
        receiver_name: address.name,
        receiver_mobile: address.mobile,
        receiver_state: address.state,
        receiver_city: address.city,
        receiver_district: address.district,
        receiver_address: address.address,
        address_id: address.addr_id
      }
    })
    if (!address) {
      this.setState({
        showAddressPicker: true
      })
    }
  }

  render () {
    const { info, address, showAddressPicker } = this.state
    console.log(address)
    if (!info) {
      return <Loading></Loading>
    }

    // TODO: orders 多商铺
    // const tradeOrders = resolveTradeOrders(info)

    return (
      <View className={classNames('trade-detail', `trade-detail__status-${info.status}`)}>
        <NavBar
          title='订单详情'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='trade-detail__status'>
          <Text className='trade-detail__status-text'>{info.status_desc_name}</Text>
          <Image
            mode='aspectFill'
            className='trade-detail__status-ico'
            src={`/assets/imgs/trade/${info.status_img}`}
          />
        </View>
        {
          info.status_desc === 'lucky'
            ? <View className='trade-detail__addr' onClick={this.toggleAddressPicker.bind(this, true)}>
                <SpCell
                  icon='map-pin'
                >
                  {
                    info.address_id
                      ? <View className='address-info__bd'>
                        <Text className='address-info__receiver'>
                          收货人：{info.receiver_name} {info.receiver_mobile}
                        </Text>
                        <Text className='address-info__addr'>
                          收货地址：{info.receiver_state}{info.receiver_city}{info.receiver_district}{info.receiver_address}
                        </Text>
                      </View>
                      : <View className='address-info__bd'>
                        <Text className='address-info__null'>
                          请选择收货地址
                        </Text>
                      </View>
                  }
                </SpCell>
              </View>
            : null
        }

        <View className='sec sec-orders'>
          {info.shop_name && (
            <View className='sec-orders__hd'>
              <Text>{info.shop_name}</Text>
            </View>
          )}
          <View className='sec-orders__bd'>
            <OrderItem
              payType='point'
              info={info}
            />
            <View className='trade-detail__total'>
              {info.point > 0 && (
                <SpCell
                  className='trade-detail__total-item'
                  title='积分'
                  border={false}
                >
                  <Price noSymbol noDecimal value={info.point} />
                </SpCell>
              )}
            </View>
          </View>
        </View>

        <View className='sec trade-extra'>
          <View className='trade-extra__bd'>
            <Text>订单编号：{info.luckydraw_trade_id}</Text>
            <Text>创建时间：{info.created}</Text>
          </View>
          <View className='trade-extra__ft'>
            <AtButton size='small' onClick={this.handleCopy}>复制</AtButton>
          </View>
        </View>

        {info.status === 'WAIT_BUYER_CONFIRM_GOODS' && (<View className='toolbar toolbar-actions'>
          <AtButton
            circle
            type='secondary'
            onClick={this.handleClickBtn.bind(this, 'confirm')}
          >确认收货</AtButton>
        </View>)}

        {info.status === 'WAIT_RATE' && (<View className='toolbar toolbar-actions'>
          <AtButton
            circle
            type='secondary'
            onClick={this.handleClickBtn.bind(this, 'rate')}
          >评价</AtButton>
        </View>)}

        <AddressPicker
          isOpened={showAddressPicker}
          value={address}
          onChange={this.handleAddressChange}
          onClickBack={this.toggleState.bind(this, 'showAddressPicker', false)}
        />

        <SpToast></SpToast>
      </View>
    )
  }
}
