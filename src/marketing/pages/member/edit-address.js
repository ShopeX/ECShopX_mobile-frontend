import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
// import EditAddress from '@/components/new-address/edit-address'
import { View, Switch, Text, Picker, Button } from '@tarojs/components'
import { AtForm, AtInput } from 'taro-ui'
import { connect } from 'react-redux'
import { SpCell, SpToast, SpNavBar } from '@/components'
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

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class AddressIndex extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      listLength: 0,
      areaArray: [[], [], []],
      areaIndexArray: [0, 0, 0],
      areaData: [],
      chooseValue: ['北京市', '北京市', '昌平区']
      // ubmitLoading: false,
    }
  }

  componentDidMount () {
    this.fetchAddressList()
    this.fetch()
  }

  fetchAddressList = async () => {
    const areaData = await api.member.areaList()
    this.setState({
      areaData
    })
  }

  async fetch () {
    Taro.showLoading()
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
    }

    Taro.hideLoading()
  }

  // 选定开户地区
  onPickerClick = () => {
    const { chooseValue, areaData } = this.state
    const [chooseProvice, chooseCity, chooseDistrict] = chooseValue
    const p_label = chooseProvice
    const c_label = chooseCity
    const d_label = chooseDistrict
    let chooseIndex = []
    let proviceArr = []
    let cityArr = []
    let countyArr = []
    areaData.map((item, index) => {
      proviceArr.push(item.label)
      if (item.label == p_label) {
        chooseIndex.push(index)
        item.children.map((c_item, c_index) => {
          cityArr.push(c_item.label)
          if (c_item.label == c_label) {
            chooseIndex.push(c_index)
            c_item.children.map((cny_item, cny_index) => {
              countyArr.push(cny_item.label)
              if (cny_item.label == d_label) {
                chooseIndex.push(cny_index)
              }
            })
          }
        })
      }
    })
    this.setState({
      areaIndexArray: chooseIndex,
      areaArray: [proviceArr, cityArr, countyArr]
    })
  }

  onPickerChange = async ({ detail }) => {
    const { value } = detail || {}
    const [one, two, three] = this.state.areaArray
    const chooseValue = [one[value[0]], two[value[1]], three[value[2]]]
    this.setState({
      areaIndexArray: value,
      chooseValue
    })
  }

  onColumnChange = async ({ detail }) => {
    const { column, value } = detail
    let { areaData, areaIndexArray, areaArray } = this.state
    if (column == 0) {
      this.setState({
        areaIndexArray: [value, 0, 0]
      })
      let cityArr = []
      let countyArr = []
      cityArr = areaData[value].children.map((item) => item.label)
      countyArr = areaData[value].children[0].children.map((item) => item.label)
      areaArray[1] = cityArr
      areaArray[2] = countyArr
      this.setState({
        areaArray: [...areaArray]
      })
    } else if (column == 1) {
      areaIndexArray[1] = value
      areaIndexArray[2] = 0
      this.setState(
        {
          areaIndexArray: [...areaIndexArray]
        },
        () => {
          let countyArr = []
          countyArr = areaData[areaIndexArray[0]].children[value].children.map((item) => item.label)
          areaArray[2] = countyArr
          this.setState({
            areaArray: [...areaArray]
          })
        }
      )
    } else {
      areaIndexArray[2] = value
      this.setState({
        areaIndexArray: [...areaIndexArray]
      })
    }
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
      setTimeout(() => {
        Taro.navigateBack()
      }, 700)
    } catch (error) {
      Taro.hideLoading()
      return false
    }
    Taro.hideLoading()
  }

  render () {
    const { colors } = this.props
    const { info, areaIndexArray, areaArray, chooseValue } = this.state
    return (
      <View className='page-address-edit' style={isWxWeb && { paddingTop: 0 }}>
        {/*<EditAddress*/}
        {/*address={getCurrentInstance().params.address}*/}
        {/*addressID={getCurrentInstance().params.address_id}*/}
        {/*/>*/}
        <SpNavBar title='编辑地址' leftIconType='chevron-left' fixed='true' />
        <AtForm onSubmit={this.handleSubmit}>
          <View className='page-address-edit__form'>
            <AtInput
              title='收件人姓名'
              name='username'
              value={info.username}
              onChange={this.handleChange.bind(this, 'username')}
            />
            <AtInput
              title='手机号码'
              name='telephone'
              maxLength={11}
              value={info.telephone}
              onChange={this.handleChange.bind(this, 'telephone')}
            />
            <Picker
              mode='multiSelector'
              onClick={this.onPickerClick}
              onChange={this.onPickerChange}
              onColumnChange={this.onColumnChange}
              value={areaIndexArray}
              range={areaArray}
            >
              <View className='picker' onClick={this.onPickerClick}>
                <View className='picker__title'>所在区域</View>
                {/* {areaArray[0][areaIndexArray[0]]}
                {areaArray[1][areaIndexArray[1]]}
                {areaArray[2][areaIndexArray[2]]} */}
                <Text>{chooseValue.join('') || '选择地区'}</Text>
              </View>
            </Picker>
            <AtInput
              title='详细地址'
              name='adrdetail'
              value={info.adrdetail}
              onChange={this.handleChange.bind(this, 'adrdetail')}
            />
            <AtInput
              title='邮政编码'
              name='postalCode'
              value={info.postalCode}
              onChange={this.handleChange.bind(this, 'postalCode')}
            />
          </View>

          <View className='sec'>
            <SpCell title='设为默认地址'>
              <Switch checked={info.is_def} onChange={this.handleDefChange.bind(this)} />
            </SpCell>
          </View>

          <View className='btns'>
            {process.env.TARO_ENV === 'weapp' ? (
              <Button
                type='primary'
                // onClick={this.handleSubmit}
                formType='submit'
                style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
              >
                提交
              </Button>
            ) : (
              <Button
                type='primary'
                // onClick={this.handleSubmit}
                formType='submit'
                style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
              >
                提交
              </Button>
            )}
          </View>
        </AtForm>

        <SpToast />
      </View>
    )
  }
}
