import Taro, { Component } from '@tarojs/taro'
import {View, Switch, Text, Picker} from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpCell } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import S from '@/spx'

import './edit.scss'

export default class AddressEdit extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      info: { ...this.props.value },
      areaList: [],
      multiIndex: [],
      listLength: 0
    }
  }

  componentDidMount () {

    this.fetch()
  }

  async fetch () {
    const { list } = await api.member.addressList()
    this.setState({
      listLength: list.length
    })
    const { info } = this.state
    let res = await api.member.areaList()
    const nList = pickBy(res, {
      label: 'label',
      children: 'children',
    })
    this.nList = nList
    let arrProvice = []
    let arrCity = []
    let arrCounty = []
    nList.map((item, index) => {
      arrProvice.push(item.label)
      if(index === 0) {
        item.children.map((c_item, c_index) => {
          arrCity.push(c_item.label)
          if(c_index === 0) {
            c_item.children.map(cny_item => {
              arrCounty.push(cny_item.label)
            })
          }
        })
      }
    })
    info.province = arrProvice[0]
    info.city = arrCity[0]
    info.county = arrCounty[0]
    this.setState({
      areaList: [arrProvice, arrCity, arrCounty],
    }, ()=>{
      this.setState({
        multiIndex: [0, 0, 0],
        info
      })
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.info) {
      this.setState({
        info: { ...nextProps.value }
      })
    }
  }

  // 选定开户地区
  bindMultiPickerChange = async (e) => {
    const { info } = this.state
    this.nList.map((item, index) => {
      if(index === e.detail.value[0]) {
        info.province = item.label
        item.children.map((s_item,sIndex) => {
          if(sIndex === e.detail.value[1]) {
            info.city = s_item.label
            s_item.children.map((th_item,thIndex) => {
              if(thIndex === e.detail.value[2]) {
                info.county = th_item.label
              }
            })
          }
        })
      }
    })
    this.setState({ info })
  }

  bindMultiPickerColumnChange = (e) => {
    const { areaList, multiIndex } = this.state
    if(e.detail.column === 0) {
      this.setState({
        multiIndex: [e.detail.value, 0, 0]
      })
      this.nList.map((item, index) => {
        if(index === e.detail.value) {
          let arrCity = []
          let arrCounty = []
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if(c_index === 0) {
              c_item.children.map(cny_item => {
                arrCounty.push(cny_item.label)
              })
            }
          })
          areaList[1] = arrCity
          areaList[2] = arrCounty
          this.setState({ areaList })
        }
      })
    } else if (e.detail.column === 1) {
      multiIndex[1] = e.detail.value
      this.setState({ multiIndex })
      this.nList[multiIndex[0]].children.map((c_item, c_index) => {
        if(c_index === e.detail.value) {
          let arrCounty = []
          c_item.children.map(cny_item => {
            arrCounty.push(cny_item.label)
          })
          areaList[2] = arrCounty
          this.setState({ areaList })
        }
      })
    } else {
      multiIndex[2] = e.detail.value
      this.setState({ multiIndex })
    }
  }

  handleSubmit = async (e) => {
    const { value } = e.detail
    const data = {
      ...this.state.info,
      ...value
    }

    if (!data.is_def) {
      data.is_def = 0
    }
    if(this.state.listLength === 0) {
      data.is_def = 1
    }

    if (!data.username) {
      return S.toast('请输入收件人')
    }

    if (!data.telephone || !/1\d{10}/.test(data.telephone)) {
      return S.toast('请输入正确的手机号')
    }

    if (!data.province) {
      return S.toast('请选择所在区域')
    }

    if (!data.adrdetail) {
      return S.toast('请输入详细地址')
    }
    // return false
    this.props.onChange && this.props.onChange(data)
    this.props.onClose && this.props.onClose()
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
  }

  handleDefChange = (val) => {
    const info = {
      ...this.state.info,
      is_def: val ? 1 : 0
    }

    this.setState({
      info
    })
  }

  handleDelete = () => {
    this.props.onDelete(this.state.info)
  }

  render () {
    const { info, areaList, multiIndex } = this.state
    if (!info) {
      return null
    }
    //
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
            <Picker
              mode='multiSelector'
              onChange={this.bindMultiPickerChange}
              onColumnChange={this.bindMultiPickerColumnChange}
              value={multiIndex}
              range={areaList}
            >
              <View className='picker'>
                <View className='picker__title'>所在区域</View>
                {
                  info.address_id
                    ? `${info.province}${info.city}${info.county}`
                    : <View>
                        {
                          areaList.length > 0
                            ? <Text>{areaList[0][multiIndex[0]]}{areaList[1][multiIndex[1]]}{areaList[2][multiIndex[2]]}</Text>
                            : null
                        }
                      </View>
                }
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
            <SpCell
              title='设为默认地址'
            >
              <Switch
                checked={info.is_def}
                onChange={this.handleDefChange}
              />
            </SpCell>
          </View>

          <View className='btns'>
            {
              process.env.TARO_ENV === 'weapp'
                ? <AtButton type='primary' formType='submit'>提交</AtButton>
                : <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>提交</AtButton>
            }
            {
              info.address_id && (<AtButton onClick={this.handleDelete}>删除</AtButton>)
            }
          </View>
        </AtForm>
      </View>
    )
  }
}
