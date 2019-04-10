import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import EditAddress from '@/components/new-address/edit-address'

export default class AddressIndex extends Component {

  config = {
    navigationBarTitleText: '地址管理'
  }

  componentDidMount() {
    console.log(this.$router.params.address_id, 29)
  }

  // handleClickBack () {
  //   return Taro.navigateBack()
  // }
  //
  // handleAddressChange = () => {
  // }

  render () {
    return (
      <EditAddress
        address={this.$router.params.address}
        addressID={this.$router.params.address_id}
      />
    )
  }
}
