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
      list: [],
      areaList: [],
      multiIndex: [],
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    let res = await api.member.areaList()
    const nList = pickBy(res, {
      label: 'label',
      children: 'children',
    })
    let arr_label = []
    let s_arr_label = []
    let th_arr_label = []
    let arr = []
    let s_arr = []
    let th_arr = []
    let all_arr =[]
    res.map(item => {
      arr_label.push(item.label)
      arr.push({label:item.label,children:item.children})
    })
    arr[0].children.map(item => {
      s_arr_label.push(item.label)
      s_arr.push({label:item.label,children:item.children})
    })
    s_arr[0].children.map(item => {
      th_arr_label.push(item.label)
      th_arr.push({label:item.label,children:item.children})
    })
    all_arr[0] = arr_label
    all_arr[1] = s_arr_label
    all_arr[2] = th_arr_label
    this.setState({
      areaList: all_arr,
      list: nList,
      multiIndex: [0, 0, 0]
    })
    console.log(all_arr, arr, s_arr, th_arr, 31)
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const { list, info } = this.state
    list.map((item, index) => {
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
    this.setState({
      info
    })
  }

  bindMultiPickerColumnChange = async (e) => {
    const { list, areaList, multiIndex } = this.state
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    if(e.detail.column === 0) {
      this.setState({
        multiIndex: [e.detail.value, 0, 0]
      })
      list.map(item=> {
        if (item.label === areaList[0][e.detail.value]) {
          let s_arr = []
          let th_arr = []
          item.children.map((s_item, s_index) => {
            s_arr.push(s_item.label)
            if(s_index === 0) {
              s_item.children.map(th_item => {
                th_arr.push(th_item.label)
              })
            }
          })
          areaList[1] = s_arr
          areaList[2] = th_arr
          this.setState({areaList})
        }
      })
    }else if (e.detail.column === 1) {
      let indexSarr = multiIndex
      indexSarr[1] = e.detail.value
      this.setState({
        multiIndex: indexSarr
      })
      console.log(multiIndex, list[multiIndex[0]])
      let th_arr = []
      list[multiIndex[0]].children.map(item => {
        if (item.label === areaList[1][e.detail.value]) {
          item.children.map(th_item => {
            th_arr.push(th_item.label)
          })
        }
      })
      areaList[2] = th_arr
      this.setState({areaList})
    }else {
      let indexTharr = multiIndex
      indexTharr[2] = e.detail.value
      this.setState({
        multiIndex: indexTharr
      })
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

    if (!data.username) {
      return S.toast('请输入收件人')
    }

    if (!data.telephone || !/1\d{10}/.test(data.telephone)) {
      return S.toast('请输入正确的手机号')
    }

    if (!data.area) {
      return S.toast('请选择所在区域')
    }

    if (!data.adrdetail) {
      return S.toast('请输入详细地址')
    }
    // console.log(data, 182)
    // return false
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
      is_def: val ? 1 : 0
    }

    this.setState({
      info
    })
  }

  handleDelete = () => {
    this.props.onDelete(this.state.info)
  }
  handleBlur = e => {
    console.log(e)
  }

  render () {
    const { info, areaList, multiIndex } = this.state
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
              onBlur={this.handleBlur.bind(this)}
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
              onColumnchange={this.bindMultiPickerColumnChange}
              value={multiIndex}
              range={areaList}
            >
              <View className='picker'>
                <View className='picker__title'>所在区域</View>
                <Text>{areaList[0][multiIndex[0]]}{areaList[1][multiIndex[1]]}{areaList[2][multiIndex[2]]}</Text>
                {/*<Text*/}
                  {/*className={classNames(item.value ? 'pick-value' : 'pick-value-null')}*/}
                {/*>{item.value ? item.value : `请选择${item.name}`}</Text>*/}
              </View>
            </Picker>
            {/*<AtInput*/}
              {/*title='所在区域'*/}
              {/*name='area'*/}
              {/*value={info.area}*/}
              {/*onChange={this.handleChange.bind(this, 'area')}*/}
            {/*/>*/}

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
