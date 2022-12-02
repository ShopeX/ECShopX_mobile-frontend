import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
// import EditAddress from '@/components/new-address/edit-address'
import { View, Switch, Text, Picker, Button } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { connect } from 'react-redux'
import { SpCell, SpToast, SpNavBar, SpAddress } from '@/components'
import api from '@/api'
import { isWxWeb } from '@/utils'
import S from '@/spx'

import './edit-address.scss'

//转换属性
const traverseData = (data) => {
  let item = []
  data.forEach((d) => {
    let newData = {}
    newData.name = d.label
    if (d.children) {
      newData.subList = traverseData(d.children)
    }
    item.push(newData)
  })
  return item
}

@connect(
  ({ colors }) => ({
    colors: colors.current
  }),
  (dispatch) => ({
    updateChooseAddress: (address) =>
      dispatch({ type: 'user/updateChooseAddress', payload: address })
  })
)
export default class AddressIndex extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      info: {},
      listLength: 0,
      areaArray: [[], [], []],
      areaIndexArray: [0, 0, 0],
      areaData: [],
      chooseValue: ['', '', ''],
      isOpened: false
      // ubmitLoading: false,
    }
  }

  async componentDidMount() {
    await this.fetchAddressList()
    await this.fetch()
    Taro.setNavigationBarTitle({
      title: this.setNavigationBarTitle()
    })
  }

  setNavigationBarTitle = () => {
    return this.state.info.user_id ? '编辑地址' : '新增地址'
  }

  fetchAddressList = async () => {
    const areaData = await api.member.areaList()
    this.setState({
      areaData
    })
  }

  async fetch() {
    Taro.showLoading({ title: '' })
    const { list } = await api.member.addressList()
    this.setState({
      listLength: list.length
    })

    list.map((a_item) => {
      if (a_item.address_id === this.$instance.router.params.address_id) {
        this.setState({
          info: a_item,
          chooseValue: [a_item.province, a_item.city, a_item.county]
        })
      }
    })

    if (this.$instance.router.params.isWechatAddress) {
      try {
        const resAddress = await Taro.chooseAddress()
        const query = {
          province: resAddress.provinceName,
          city: resAddress.cityName,
          county: resAddress.countyName,
          adrdetail: resAddress.detailInfo,
          is_def: 0,
          postalCode: resAddress.postalCode,
          telephone: resAddress.telNumber,
          username: resAddress.userName
        }
        this.setState({
          info: query,
          chooseValue: [query.province, query.city, query.county]
        })
      } catch (err) {
        console.error(err)
        Taro.navigateBack()
      }
    }

    Taro.hideLoading()
  }

  onPickerClick = () => {
    this.setState({
      isOpened: true
    })
  }

  handleClickClose = () => {
    this.setState({
      isOpened: false
    })
  }

  onPickerChange = (selectValue) => {
    const chooseValue = [selectValue[0].label, selectValue[1].label, selectValue[2].label]
    this.setState({
      chooseValue
    })
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    this.setState({
      info
    })
  }

  handleDefChange = (e) => {
    const info = {
      ...this.state.info,
      is_def: e.detail.value ? 1 : 0
    }

    this.setState({
      info
    })
  }

  handleSubmit = async (e) => {
    const { value } = e.detail || {}
    const { chooseValue } = this.state
    const data = {
      ...this.state.info,
      ...value
    }

    if (!data.is_def) {
      data.is_def = '0'
    } else {
      data.is_def = '1'
    }
    if (this.state.listLength === 0) {
      data.is_def = '1'
    }

    if (!data.username) {
      return S.toast('请输入收件人')
    }

    if (!data.telephone) {
      return S.toast('请输入手机号')
    }

    // if (!data.province) {
    data.province = chooseValue[0]
    data.city = chooseValue[1]
    data.county = chooseValue[2]
    // }

    if (!data.adrdetail) {
      return S.toast('请输入详细地址')
    }

    Taro.showLoading('正在提交')

    try {
      await api.member.addressCreateOrUpdate(data)
      if (data.address_id) {
        S.toast('修改成功')
      } else {
        S.toast('创建成功')
      }
      this.props.updateChooseAddress(data)
      setTimeout(() => {
        Taro.navigateBack()
      }, 700)
    } catch (error) {
      Taro.hideLoading()
      return false
    }
    Taro.hideLoading()
  }

  render() {
    const { colors } = this.props
    const { info, areaIndexArray, areaArray, chooseValue, isOpened } = this.state
    console.log('color', colors, info)
    return (
      <View className='page-address-edit' style={isWxWeb && { paddingTop: 0 }}>
        <SpNavBar title={this.setNavigationBarTitle()} leftIconType='chevron-left' fixed='true' />
        <View className='page-address-edit__form'>
          <SpCell
            className='logistics-no'
            title='收件人'
            value={
              <AtInput
                name='username'
                value={info.username}
                placeholder='收件人姓名'
                onChange={this.handleChange.bind(this, 'username')}
              />
            }
          ></SpCell>

          <SpCell
            className='logistics-no'
            title='手机号码'
            value={
              <AtInput
                name='telephone'
                maxLength={11}
                value={info.telephone}
                placeholder='收件人手机号码'
                onChange={this.handleChange.bind(this, 'telephone')}
              />
            }
          ></SpCell>

          <SpCell
            className='logistics-no province'
            title='所在区域'
            value={
              <View className='picker' onClick={this.onPickerClick}>
                {chooseValue.join('') === '' ? (
                  <Text>选择省/市/区</Text>
                ) : (
                  <Text style={{ color: '#000' }}>{chooseValue.join('/')}</Text>
                )}
              </View>
            }
          ></SpCell>
          <SpAddress
            isOpened={isOpened}
            onClose={this.handleClickClose}
            onChange={this.onPickerChange}
          />

          <SpCell
            className='logistics-no'
            title='详细地址'
            value={
              <AtInput
                name='adrdetail'
                value={info.adrdetail}
                placeholder='请填写详细地址（街道、门牌）'
                onChange={this.handleChange.bind(this, 'adrdetail')}
              />
            }
          ></SpCell>

          {/* <SpCell
            className='logistics-no'
            title='邮政编码'
            value={
              <AtInput
                name='postalCode'
                value={info.postalCode}
                onChange={this.handleChange.bind(this, 'postalCode')}
              />
            }
          ></SpCell> */}
        </View>

        <View className='sec'>
          <SpCell
            title='设为默认地址'
            iisLink
            value={
              <Switch
                checked={info.is_def}
                className='def-switch'
                onChange={this.handleDefChange.bind(this)}
                color={colors.data[0].primary}
              />
            }
          ></SpCell>
        </View>
        <View className='btns'>
          {/* <AtButton
            circle
            type='primary'
            className='save-btn'
            onClick={this.handleSubmit}
            style={`background: ${colors}; border-color: ${colors};border-radius: 25px;`}
          >
            保存并使用
          </AtButton> */}
          <Button
            type='primary'
            onClick={this.handleSubmit}
            className='submit-btn'
            style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};border-radius: 25px;`}
          >
            保存并使用
          </Button>
        </View>
      </View>
    )
  }
}
