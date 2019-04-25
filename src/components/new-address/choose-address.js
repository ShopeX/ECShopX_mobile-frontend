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
          className='address-info'
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
                      <Text>收货地址：</Text>
                      <View className='info-trade'>
                        <View className='user-info-trade'>
                          <Text>{isAddress.name}</Text>
                          <Text>{isAddress.mobile}</Text>
                        </View>
                        <Text className='address-detail'>{isAddress.province}{isAddress.state}{isAddress.district}{isAddress.address}</Text>
                      </View>
                    </View>
                  </View>
                : <View className='address-info__bd'>请选择收货地址</View>
            }
          </SpCell>
          <View className='other-address'>
            <Text className='in-icon in-icon-xinzeng icon-add'> </Text>
            <Text>使用其他地址</Text>
          </View>
        </View>
      </View>
    )
  }
}
