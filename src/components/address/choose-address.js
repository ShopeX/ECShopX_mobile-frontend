import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpCell, SpToast, SpNote } from '@/components'
import { pickBy, log } from '@/utils'
import { connect } from '@tarojs/redux'
import api from '@/api'
import find from 'lodash/find'
import AddressEdit from '../address/edit'
import S from '@/spx'


import './address.scss'
@connect(( { address } ) => ({
  address: address.current,
}), (dispatch) => ({
  onAddressChoose: (address) => dispatch({ type: 'address/choose', payload: address }),
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
    }
  }

  clickTo = (choose) => {
    Taro.navigateTo({
      url: `/pages/member/address?isPicker=${choose}`
    })
  }

  render () {
    const { isAddress } = this.props

    return (
      <View className='address-picker'>
        <View
          className='address'
          onClick={this.clickTo.bind(this, 'choose')}
        >
          <SpCell
            isLink
            // icon='map-pin'
          >
            {
              isAddress
                ? <View className='address-picker__bd'>
                    <View className='address-receive'>
                      <View className='info-trade'>
                        <View className='address-area'>{isAddress.province}{isAddress.state}{isAddress.district}</View>
                        <View className='address-detail'>{isAddress.address}</View>
                        <View className='user-info-trade'>
                          <Text className='name'>{isAddress.name}</Text>
                          <Text>{isAddress.mobile}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                : <View className='address-info__bd'>请选择收货地址</View>
            }
          </SpCell>
        </View>
      </View>
    )
  }
}
