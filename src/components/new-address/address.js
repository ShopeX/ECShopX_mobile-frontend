import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { SpCell, SpToast, SpNote } from '@/components'
import { classNames, log } from '@/utils'
import {connect} from "@tarojs/redux";
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
export default class Address extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClickBack: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      list: [],
      // mode: 'default',
      // curAddress: null
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

  enterEdit = (item, e) => {
    if(e) {
      e.stopPropagation()
    }
    Taro.navigateTo({
      url: `/pages/member/edit-address?address_id=${item.address_id}`
    })
  }

  handleClickAddAddress = () => {
    Taro.navigateTo({
      url: '/pages/member/edit-address'
    })
  }

  wxAddress = async () => {
    Taro.navigateTo({
      url: `/pages/member/edit-address?address=wx`
    })
    // const res = await Taro.chooseAddress()
    // const { errMsg } = res
    // if (errMsg === 'chooseAddress:ok') {
    //   log.debug(`[wx chooseAddress] address:`, res)
      // const query = {
      //   province: res.provinceName,
      //   city: res.cityName,
      //   county: res.countyName,
      //   adrdetail: res.detailInfo,
      //   is_def: 0,
      //   postalCode: res.postalCode,
      //   telephone: res.telNumber,
      //   username: res.userName,
      // }
      // Taro.navigateTo({
      //   url: `/pages/member/edit-address?address=wx`
      // })
      // await api.member.addressCreateOrUpdate(query)
      // this.fetch()
      // console.log(query, 80)
    // } else if (errMsg.indexOf('auth deny') >= 0) {
    //   log.debug(`[wx chooseAddress] error: ${errMsg}`)
    // }

    // console.info('unkown error, res:', res)
  }

  handleClickAddress = (item) => {
    console.log(item, 91)
    if(!this.props.paths) {
      return
    }
    this.props.onAddressChoose(item)
    setTimeout(()=>{
      Taro.navigateBack()
    }, 700)
  }
  // changeSelection (params = {}) {
  //   const { list } = this.state
  //   if (list.length === 0) {
  //     this.props.onChange(null)
  //     return
  //   }
  //   const { address_id } = params
  //   const address = find(list, addr => address_id ? address_id === addr.address_id : addr.is_def > 0) || list[0] || null
  //   // console.log(address, 66)
  //   // if (!params || !params.address_id) {
  //   //   // list.filter(item => !this.state.selection.has(item.item_id))
  //   //   const address = list.filter(item => item.is_def === true ? item : null)
  //   //   console.log(address, 53)
  //   //   this.props.onChange(address)
  //   //   return
  //   // }
  //   log.debug('[address picker] change selection: ', address)
  //   this.props.onChange(address)
  // }

  // handleGoBack = () => {
  //   this.setState({
  //     mode: 'default',
  //     curAddress: null
  //   })
  //   this.props.onClickBack()
  // }

  // handleClickAddress = (address, e) => {
  //   this.changeSelection(address)
  //   this.props.onClickBack()
  // }

  // handleRetrieveWxAddress = async () => {
  //   const res = await Taro.chooseAddress()
  //   const { errMsg } = res
  //   if (errMsg === 'chooseAddress:ok') {
  //     log.debug(`[wx chooseAddress] address:`, res)
  //   } else if (errMsg.indexOf('auth deny') >= 0) {
  //     log.debug(`[wx chooseAddress] error: ${errMsg}`)
  //   }
  //
  //   console.info('unkown error, res:', res)
  // }
  //
  // handleSaveAddress = async (address) => {
  //   try {
  //     await api.member.addressCreateOrUpdate(address)
  //     if(address.address_id) {
  //       S.toast('修改成功')
  //     } else {
  //       S.toast('创建成功')
  //     }
  //
  //     await this.fetch(() => {
  //       // update current address
  //       const params = this.props.value ? { ...this.props.value } : null
  //       this.changeSelection(params)
  //     })
  //
  //     this.exitEdit()
  //   } catch (error) {
  //     return false
  //   }
  //
  //
  // }
  //
  // handleDelAddress = async (address) => {
  //   const { address_id } = address
  //   await api.member.addressDelete(address_id)
  //   const list = this.state.list.filter(addr => addr.address_id !== address_id)
  //   const isDeleteCurAddress = this.state.curAddress && this.state.curAddress.address_id === address.address_id
  //
  //   this.setState({
  //     list
  //   }, () => {
  //     if (isDeleteCurAddress) {
  //       this.changeSelection()
  //     }
  //   })
  //   this.exitEdit()
  // }
  //
  // enterEdit (address = null, e) {
  //   if (e) {
  //     e.stopPropagation()
  //   }
  //   this.setState({
  //     mode: 'edit',
  //     curAddress: address,
  //   })
  // }
  //
  // exitEdit = () => {
  //   this.setState({
  //     mode: 'default',
  //     curAddress: null
  //   })
  // }

  render () {
    const { curAddress, list } = this.state

    return (
      <View className='address-picker'>
        <View className='add_address' onClick={this.handleClickAddAddress.bind(this)}>
          新增地址
        </View>
        {
          (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) && (
            <View className='sec'>
              <SpCell
                isLink
                iconPrefix='sp-icon'
                icon='weixin'
                title='获取微信收货地址'
                onClick={this.wxAddress.bind(this)}
              />
            </View>)
        }
        <View className='sec address-list'>
          {
            list.map(item => {
              return (
                <SpCell
                  key={item.address_id}
                  onClick={this.handleClickAddress.bind(this, item)}
                >
                  <View className='address-item'>
                    <Text className='address-item__receiver'>
                      <Text className='address-item__name'>{item.username}</Text>
                      <Text className='address-item__mobile'>{item.telephone}</Text>
                      <Text className='address-item__addr'>{item.province}{item.city}{item.county}{item.adrdetail}</Text>
                    </Text>
                    <Text
                      className='address-item__ft'
                      onClick={this.enterEdit.bind(this, item)}
                    >编辑</Text>
                  </View>
                </SpCell>
              )
            })
          }
        </View>

        {
          list.length === 0 && (
            <SpNote
              img='address_empty.png'
            >赶快添加新地址吧~</SpNote>
          )
        }

      </View>
    )
  }
}
