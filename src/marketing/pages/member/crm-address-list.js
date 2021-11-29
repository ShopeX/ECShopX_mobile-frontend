import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
// import AddressList from '@/components/new-address/address'
import { connect } from 'react-redux'
import { SpToast, SpCell, SpNavBar, SpCheckbox } from '@/components'
import S from '@/spx'
import api from '@/api'

import './crm-address-list.scss'

const ADDRESS_ID = 'third_data'

@connect(
  ({ address, colors }) => ({
    colors: colors.current
  }),
  (dispatch) => ({})
)
export default class CrmAddressList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      isPicker: false,
      selectedId: null
    }
  }

  componentDidMount() {
    // this.fetch()
  }

  componentDidShow() {
    // this.fetch()
  }

  // async fetch () {
  //   Taro.showLoading()
  //   const data = await api.member.crmAddressList() // 此接口已删除
  //   Taro.hideLoading()
  //   let selectedId = data.find(addr => addr.is_def > 0) || null
  //   this.setState({
  //     list:data,
  //     selectedId:selectedId && selectedId[ADDRESS_ID]
  //   })
  // }

  handleClickChecked = async (item) => {
    this.setState({
      selectedId: item[ADDRESS_ID]
    })
    // if (item.third_data) {
    //   Taro.navigateTo({
    //     url: `/marketing/pages/member/crm-address?address_id=${item.third_data}`
    //   })
    // }
    this.setState({
      submitLoading: true
    })
    try {
      await api.member.addressCreateOrUpdate(item)
      S.toast('创建成功')
      setTimeout(() => {
        Taro.navigateBack()
      }, 700)
    } catch (error) {
      return false
    }
    this.setState({
      submitLoading: false
    })
  }
  render() {
    const { colors } = this.props
    const { list, selectedId } = this.state
    console.log('list', list)
    return (
      <View className='page-address-index'>
        <SpNavBar title='收货地址' leftIconType='chevron-left' fixed='true' />
        <View className='member-address-list'>
          {list.map((item) => {
            return (
              <View
                key={item[ADDRESS_ID]}
                className='address-item'
                onClick={this.handleClickChecked.bind(this, item)}
              >
                <View className='address-item__checked'>
                  {item[ADDRESS_ID] === selectedId ? (
                    <Text className='icon-check address-item__checked'></Text>
                  ) : null}
                </View>
                <View className='address-item__content'>
                  <View className='address-item__title'>
                    <Text className='address-item__info'>{item.username}</Text>
                  </View>
                  <View className='address-item__detail'>
                    {item.province}
                    {item.city}
                    {item.county}
                    {item.adrdetail}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <SpToast />
      </View>
    )
  }
}
