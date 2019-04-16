import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import AddressList from '@/components/new-address/address'
import api from '@/api'

import './address.scss'

export default class AddressIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: [],
      // isItemChecked: true,
      ItemIndex: null,
      isDefaultChecked: true,
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentDidShow() {
    this.fetch()
  }

  async fetch () {
    Taro.showLoading({
      mask: true
    })
    const { list } = await api.member.addressList()
    Taro.hideLoading()

    this.setState({
      list
    })
  }

  handleClickChecked = (index) => {
    this.setState({
      // isItemChecked: !this.state.isItemChecked,
      ItemIndex: index
    })
  }

  handleClickToEdit = (item) => {
    Taro.navigateTo({
      url: `/pages/member/edit-address?address_id=${item.address_id}`
    })
  }

  render () {
    const { ItemIndex } = this.state

    return (
      <View className='page-address-index'>
        {/*<AddressList*/}
          {/*paths={this.$router.params.paths}*/}
        {/*/>*/}
        <View className='member-address-list'>
          {
            list.map((item, index) => {
              return (
                <View key={index} className='address-item'>
                  <View className='address-item__check' onClick={this.handleClickChecked.bind(this, index)}>
                    {
                      index === ItemIndex
                        ? <Text className='in-icon in-icon-check-copy address-item__checked'> </Text>
                        : <Text className='address-item__unchecked'> </Text>
                    }
                  </View>
                  <View className='address-item__content'>
                    <View className='address-item__title'>
                      <Text className='address-item__info'>{item.username}</Text>
                      <Text className='address-item__info'>{item.telephone}</Text>
                    </View>
                    <View className='address-item__detail'>{item.province}{item.city}{item.county}{item.adrdetail}</View>
                    <View className='address-item__footer'>
                      <View className='address-item__footer_default'>
                        {
                          isDefaultChecked
                            ? <Text className='in-icon in-icon-check-copy default__icon default__checked'> </Text>
                            : <Text className='in-icon in-icon-check-copy default__icon'> </Text>
                        }
                        <Text className='default-text'>设为默认</Text>
                      </View>
                      <View className='address-item__footer_edit'>
                        <View className='footer-text' onClick={this.handleClickToEdit.bind(this, item)}>
                          <Text className='in-icon in-icon-edit footer-icon'> </Text>
                          <Text>编辑</Text>
                        </View>
                        <View className='footer-text'>
                          <Text className='in-icon in-icon-trash footer-icon'> </Text>
                          <Text>删除</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>
        <View className='member-address-add'>添加新地址</View>
      </View>

    )
  }
}
