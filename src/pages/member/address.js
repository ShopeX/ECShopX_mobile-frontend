import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import AddressList from '@/components/new-address/address'
import { connect } from "@tarojs/redux";
import { SpToast, SpCell } from '@/components'
import S from '@/spx'
import api from '@/api'

import './address.scss'

const ADDRESS_ID = 'address_id'

@connect(( { address } ) => ({
  address: address.current,
}), (dispatch) => ({
  onAddressChoose: (address) => dispatch({ type: 'address/choose', payload: address }),
}))
export default class AddressIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: [],
      isPicker: false,
      selectedId: null
    }
  }

  componentDidMount () {
    // this.fetch()
  }

  componentDidShow() {
    this.fetch()
  }

  async fetch () {
    if(this.$router.params.isPicker) {
      this.setState({
        isPicker: true
      })
    }
    Taro.showLoading({
      mask: true
    })
    const { list } = await api.member.addressList()
    Taro.hideLoading()

    let selectedId = null
    if (this.props.address) {
      selectedId = this.props.address[ADDRESS_ID]
    } else {
      selectedId = list.find(addr => addr.is_def > 0) || null
    }

    this.setState({
      list,
      selectedId
    })
  }

  handleClickChecked = (item) => {
    this.setState({
      selectedId: item[ADDRESS_ID]
    })

    this.props.onAddressChoose(item)
    setTimeout(()=>{
      Taro.navigateBack()
    }, 700)
  }

  handleChangeDefault = async (item) => {
    item.is_def = 1
    try {
      await api.member.addressCreateOrUpdate(item)
      if(item.address_id) {
        S.toast('修改成功')
      }
      setTimeout(() => {
        this.fetch()
      }, 700)
    } catch (error) {
      return false
    }
  }

  handleClickToEdit = (item) => {
    if (item.address_id) {
      Taro.navigateTo({
        url: `/pages/member/edit-address?address_id=${item.address_id}`
      })
    } else {
      Taro.navigateTo({
        url: '/pages/member/edit-address'
      })
    }
  }

  handleDelete = async (item) => {
    await api.member.addressDelete(item.address_id)
    S.toast('删除成功')
    setTimeout(() => {
      this.fetch()
    }, 700)
  }

  wxAddress = () => {
    Taro.navigateTo({
      url: `/pages/member/edit-address?isWechatAddress=true`
    })
  }

  render () {
    const { selectedId, isItemChecked, isPicker, list } = this.state
    return (
      <View className='page-address-index'>
        {
          process.env.TARO_ENV === 'weapp'
            ? <SpCell
                isLink
                iconPrefix='sp-icon'
                icon='weixin'
                title='获取微信收货地址'
                onClick={this.wxAddress.bind(this)}
              />
            : null
        }
        <View className='member-address-list'>
          {
            list.map((item, index) => {
              return (
                <View key={item[ADDRESS_ID]} className='address-item'>
                  {
                    isPicker && <View className='address-item__check' onClick={this.handleClickChecked.bind(this, item)}>
                      {
                        item[ADDRESS_ID] === selectedId
                          ? <Text className='icon-check address-item__checked'></Text>
                          : <Text className='address-item__unchecked'> </Text>
                      }
                    </View>
                  }

                  <View className='address-item__content'>
                    <View className='address-item__title'>
                      <Text className='address-item__info'>{item.username}</Text>
                      <Text className='address-item__info'>{item.telephone}</Text>
                    </View>
                    <View className='address-item__detail'>{item.province}{item.city}{item.county}{item.adrdetail}</View>
                    <View className='address-item__footer'>
                      <View className='address-item__footer_default' onClick={this.handleChangeDefault.bind(this, item)}>
                        {
                          item.is_def
                            ? <Text className='icon-check default__icon default__checked'> </Text>
                            : <Text className='icon-check default__icon'> </Text>
                        }
                        <Text className='default-text'>设为默认</Text>
                      </View>
                      <View className='address-item__footer_edit'>
                        <View className='footer-text' onClick={this.handleClickToEdit.bind(this, item)}>
                          <Text className='icon-edit footer-icon'> </Text>
                          <Text>编辑</Text>
                        </View>
                        <View className='footer-text' onClick={this.handleDelete.bind(this, item)}>
                          <Text className='icon-trash footer-icon'> </Text>
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
        <View className='member-address-add' onClick={this.handleClickToEdit.bind(this)}>添加新地址</View>

        <SpToast />
      </View>
    )
  }
}
