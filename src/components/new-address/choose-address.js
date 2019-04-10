import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { SpCell, SpToast, SpNote } from '@/components'
import { pickBy, log } from '@/utils'
import { connect } from '@tarojs/redux'
import api from '@/api'
import find from 'lodash/find'
import AddressEdit from '../address/edit'
import S from '@/spx'


import './address.scss'
@connect(( { address } ) => ({
  defaultAddress: address.defaultAddress,
}), (dispatch) => ({
  onAddressChoose: (defaultAddress) => dispatch({ type: 'address/choose', payload: defaultAddress }),
}))
export default class AddressChoose extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClickBack: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      address: {},
    }
  }

  // componentDidMount () {
  //   this.fetch(() => this.changeSelection())
  // }
  //
  // // componentDidShow() {
  // //   this.fetch()
  // // }
  //
  // async fetch (cb) {
  //   Taro.showLoading({
  //     mask: true
  //   })
  //   const { list } = await api.member.addressList()
  //   Taro.hideLoading()
  //
  //   this.setState({
  //     list
  //   }, () => {
  //     cb && cb(list)
  //   })
  // }
  //
  // changeSelection (params = {}) {
  //   const { list } = this.state
  //   // if (list.length === 0) {
  //   //   this.props.onChange(null)
  //   //   return
  //   // }
  //   const { address_id } = params
  //   let address = find(list, addr => address_id ? address_id === addr.address_id : addr.is_def > 0) || list[0] || null
  //   // console.log(address, 66)
  //   // if (!params || !params.address_id) {
  //   //   // list.filter(item => !this.state.selection.has(item.item_id))
  //   //   const address = list.filter(item => item.is_def === true ? item : null)
  //   //   console.log(address, 53)
  //   //   this.props.onChange(address)
  //   //   return
  //   // }
  //   log.debug('[address picker] change selection: ', address)
  //   this.props.onAddressChoose(address)
  //   // this.props.onChange(address)
  // }

  clickTo = (choose) => {
    Taro.navigateTo({
      url: `/pages/member/address?paths=${choose}`
    })
  }

  render () {
    const { address, list } = this.state
    const { isAddress, defaultAddress } = this.props

    return (
      <View className='address-picker'>
        <View
          className='address-info'
          onClick={this.clickTo.bind(this, 'choose')}
        >
          <SpCell
            isLink
            icon='map-pin'
          >
            {
              isAddress
                ? <View className='address-info__bd'>
                    <Text className='address-info__receiver'>
                      收货人：{isAddress.name} {isAddress.mobile}
                    </Text>
                    <Text className='address-info__addr'>
                      收货地址：{isAddress.province}{isAddress.state}{isAddress.district}{isAddress.address}
                    </Text>
                  </View>
                : <View className='address-info__bd'>请选择收货地址</View>
            }

          </SpCell>
        </View>
      </View>
    )
  }
}
