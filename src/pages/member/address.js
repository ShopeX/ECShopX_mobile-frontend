import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import AddressPicker from '@/components/address/picker'

export default class AddressIndex extends Component {
  handleClickBack () {
    return Taro.navigateBack()
  }

  render () {
    return (
      <AddressPicker
        isOpened
        onClickBack={this.handleClickBack.bind(this)}
      />
    )
  }
}
