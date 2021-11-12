import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import AddressList from '@/components/new-address/address'
import { connect } from '@tarojs/redux'
import { SpToast, SpCell, SpNavBar } from '@/components'
import S from '@/spx'
import api from '@/api'
import { showLoading, hideLoading } from '@/utils'

import './address.scss'

const ADDRESS_ID = 'address_id'

@connect(
  ({ address, colors }) => ({
    address: address.current,
    colors: colors.current
  }),
  (dispatch) => ({
    onAddressChoose: (address) => dispatch({ type: 'address/choose', payload: address })
  })
)
export default class AddressIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      isPicker: false,
      selectedId: null
    }
  }

  componentDidShow() {
    this.fetch()
  }

  async fetch(isDelete = false) {
    const { isPicker, receipt_type = '', city = '' } = this.$router.params
    if (isPicker) {
      this.setState({
        isPicker: true
      })
    }
    showLoading({
      mask: true
    })
    const { list } = await api.member.addressList()
    hideLoading()
    let newList = [...list]
    if (receipt_type === 'dada' && city) {
      newList = list
        .map((item) => {
          item.disabled = item.city !== city
          return item
        })
        .sort((first) => (first.disabled ? 1 : -1))
    }
    let selectedId = null
    if (this.props.address) {
      selectedId = this.props.address[ADDRESS_ID]
    } else {
      selectedId = list.find((addr) => addr.is_def > 0) || null
    }
    this.setState({
      list: newList,
      selectedId
    })
  }

  handleClickChecked = (item) => {
    this.setState({
      selectedId: item[ADDRESS_ID]
    })

    this.props.onAddressChoose(item)
    setTimeout(() => {
      Taro.navigateBack()
    }, 700)
  }

  handleChangeDefault = async (item) => {
    item.is_def = 1
    try {
      await api.member.addressCreateOrUpdate(item)
      if (item.address_id) {
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
        url: `/marketing/pages/member/edit-address?address_id=${item.address_id}`
      })
    } else {
      Taro.navigateTo({
        url: '/marketing/pages/member/edit-address'
      })
    }
  }

  handleDelete = async (item) => {
    const { selectedId } = this.state
    await api.member.addressDelete(item.address_id)
    S.toast('删除成功')
    if (selectedId === item.address_id) {
      this.props.onAddressChoose(null)
    }
    setTimeout(() => {
      this.fetch(true)
    }, 700)
  }

  wxAddress = () => {
    Taro.navigateTo({
      url: `/marketing/pages/member/edit-address?isWechatAddress=true`
    })
  }
  crmAddress = () => {
    Taro.navigateTo({
      url: `/marketing/pages/member/crm-address-list?isCrmAddress=true`
    })
  }

  render() {
    const { colors } = this.props
    const { selectedId, isPicker, list, is_open_crmAddress } = this.state
    return (
      <View className='page-address-index'>
        {process.env.TARO_ENV === 'weapp' ? (
          <SpCell
            isLink
            iconPrefix='sp-icon'
            icon='weixin'
            title='获取微信收货地址'
            onClick={this.wxAddress.bind(this)}
          />
        ) : null}

        <SpNavBar title='收货地址' leftIconType='chevron-left' fixed='true' />
        <View className='member-address-list'>
          {list.map((item) => {
            return (
              <View
                key={item[ADDRESS_ID]}
                className={`address-item ${item.disabled ? 'disabled' : ''}`}
              >
                {isPicker && !item.disabled && (
                  <View
                    className='address-item__check'
                    onClick={this.handleClickChecked.bind(this, item)}
                  >
                    {item[ADDRESS_ID] === selectedId ? (
                      <Text
                        className='icon-check address-item__checked'
                        style={{ color: colors.data[0].primary }}
                      ></Text>
                    ) : (
                      <Text
                        className='address-item__unchecked'
                        style={{ borderColor: colors.data[0].primary }}
                      >
                        {' '}
                      </Text>
                    )}
                  </View>
                )}

                <View className='address-item__content'>
                  <View className='address-item__title'>
                    <Text className='address-item__info'>{item.username}</Text>
                    <Text className='address-item__info'>{item.telephone}</Text>
                  </View>
                  <View className='address-item__detail'>
                    {item.province}
                    {item.city}
                    {item.county}
                    {item.adrdetail}
                  </View>
                  <View className='address-item__footer'>
                    <View
                      className='address-item__footer_default'
                      onClick={this.handleChangeDefault.bind(this, item)}
                    >
                      {item.is_def ? (
                        <Text
                          className='icon-check default__icon default__checked'
                          style={{ color: colors.data[0].primary }}
                        >
                          {' '}
                        </Text>
                      ) : (
                        <Text className='icon-check default__icon'> </Text>
                      )}
                      <Text className='default-text'>设为默认</Text>
                    </View>
                    <View className='address-item__footer_edit'>
                      <View
                        className='footer-text'
                        onClick={this.handleClickToEdit.bind(this, item)}
                      >
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
          })}
        </View>
        <View
          className='member-address-add'
          style={'background: ' + colors.data[0].primary}
          onClick={this.handleClickToEdit.bind(this)}
        >
          添加新地址
        </View>
        <SpToast />
      </View>
    )
  }
}
