import Taro, { Component } from '@tarojs/taro'
import { View, Switch } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpCell } from '@/components'
import api from '@/api'
import S from '@/spx'

import './edit.scss'

export default class AddressEdit extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      info: { ...this.props.value }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.info) {
      this.setState({
        info: { ...nextProps.value }
      })
    }
  }

  handleSubmit = async (e) => {
    const { value } = e.detail
    const data = {
      ...this.state.info,
      provinceName: '天津市',
      cityName: '市辖区',
      countyName: '和平区',
      ...value
    }

    if (!data.username) {
      return S.toast('请输入收件人')
    }

    if (!data.telephone || !/1\d{10}/.test(data.telephone)) {
      return S.toast('请输入正确的手机号')
    }

    // if (!data.area) {
    //   return S.toast('请选择所在区域')
    // }

    if (!data.detailInfo) {
      return S.toast('请输入详细地址')
    }

    let res = await api.member.addressCreate(data)
    console.log(res, 57)

    this.props.onChange && this.props.onChange(data)
    this.props.onClose && this.props.onClose()
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    console.log(info)
  }

  handleDefChange = (val) => {
    const info = {
      ...this.state.info,
      def_addr: val ? 1 : 0
    }

    this.setState({
      info
    })
  }

  handleDelete = () => {
    this.props.onDelete(this.state.info)
  }

  render () {
    const { info } = this.state
    if (!info) {
      return null
    }

    return (
      <View className='address-edit'>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec address-edit__form'>
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
            {/*<AtInput*/}
              {/*title='所在区域'*/}
              {/*name='area'*/}
              {/*value={info.area}*/}
              {/*onChange={this.handleChange.bind(this, 'area')}*/}
            {/*/>*/}
            <AtInput
              title='详细地址'
              name='detailInfo'
              value={info.detailInfo}
              onChange={this.handleChange.bind(this, 'detailInfo')}
            />
            <AtInput
              title='邮政编码'
              name='postalCode'
              value={info.postalCode}
              onChange={this.handleChange.bind(this, 'postalCode')}
            />
          </View>

          <View className='sec'>
            <SpCell
              title='设为默认地址'
            >
              <Switch
                checked={info.def_addr}
                onChange={this.handleDefChange}
              />
            </SpCell>
          </View>

          <View className='btns'>
            <AtButton type='primary' onSubmit={this.handleSubmit} formType='submit'>提交</AtButton>
            {
              info.address_id && (<AtButton onClick={this.handleDelete}>删除</AtButton>)
            }
          </View>
        </AtForm>
      </View>
    )
  }
}
