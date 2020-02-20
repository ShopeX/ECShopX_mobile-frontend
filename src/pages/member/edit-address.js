import Taro, { Component } from '@tarojs/taro'
// import EditAddress from '@/components/new-address/edit-address'
import { View, Switch, Text, Picker } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { SpCell, SpToast } from '@/components'
import api from '@/api'
import { pickBy, log } from '@/utils'
import S from '@/spx'

import './edit-address.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class AddressIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      areaList: [],
      multiIndex: [],
      listLength: 0,
      ubmitLoading: false,
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    Taro.showLoading()
    const { list } = await api.member.addressList()
    this.setState({
      listLength: list.length
    })

    list.map(a_item => {
      if(a_item.address_id === this.$router.params.address_id) {
        this.setState({
          info: a_item
        })
      }
    })

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
    this.setState({
      areaList: [arrProvice, arrCity, arrCounty],
      // areaList: [['北京'], ['北京'], ['东城']],
    })

    if (this.$router.params.isWechatAddress){
      const res = await Taro.chooseAddress()
      const query = {
        province: res.provinceName,
        city: res.cityName,
        county: res.countyName,
        adrdetail: res.detailInfo,
        is_def: 0,
        postalCode: res.postalCode,
        telephone: res.telNumber,
        username: res.userName,
      }
      this.setState({
        info: query
      })
    }
    Taro.hideLoading()
  }

  // 选定开户地区
  handleClickPicker = () => {
    let arrProvice = []
    let arrCity = []
    let arrCounty = []
    if(this.nList){
      this.nList.map((item, index) => {
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
      this.setState({
        areaList: [arrProvice, arrCity, arrCounty],
        multiIndex: [0, 0, 0]
      })
    }

  }

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
        multiIndex: [e.detail.value,0,0]
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
      multiIndex[2] = 0
      this.setState({
        multiIndex
      },()=>{
        this.nList[multiIndex[0]].children.map((c_item, c_index)  => {
          if(c_index === e.detail.value) {
            let arrCounty = []
            c_item.children.map(cny_item => {
              arrCounty.push(cny_item.label)
            })
            areaList[2] = arrCounty
            this.setState({ areaList })
          }
        })
      })

    } else {
      multiIndex[2] = e.detail.value
      this.setState({
        multiIndex
      })
    }
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
  }

  handleDefChange = (e) => {
    console.log(e.detail.value)
    const info = {
      ...this.state.info,
      is_def: e.detail.value ? 1 : 0
    }

    this.setState({
      info
    })
  }

  handleSubmit = async (e) => {
    const { value } = e.detail
    const { areaList, multiIndex } = this.state
    const data = {
      ...this.state.info,
      ...value
    }

    if (!data.is_def) {
      data.is_def = '0'
    } else {
      data.is_def = '1'
    }
    if(this.state.listLength === 0) {
      data.is_def = '1'
    }

    if (!data.username) {
      return S.toast('请输入收件人')
    }

    if (!data.telephone) {
      return S.toast('请输入手机号')
    }

    if (!data.province) {
      data.province = areaList[0][multiIndex[0]]
      data.city = areaList[1][multiIndex[1]]
      data.county = areaList[2][multiIndex[2]]
    }

    if (!data.adrdetail) {
      return S.toast('请输入详细地址')
    }
    console.log(data)
    Taro.showLoading({
      title: '正在提现',
      mask: true
    })

    this.setState({
      submitLoading: true
    })
    try {
      await api.member.addressCreateOrUpdate(data)
      if(data.address_id) {
        S.toast('修改成功')
      } else {
        S.toast('创建成功')
      }
      setTimeout(()=>{
        Taro.navigateBack()
      }, 700)
    } catch (error) {
      return false
    }
    this.setState({
      submitLoading: false
    })
  }

  render () {
    const { colors } = this.props
    const { info, multiIndex, areaList } = this.state

    return (
      <View className='page-address-edit'>
        {/*<EditAddress*/}
          {/*address={this.$router.params.address}*/}
          {/*addressID={this.$router.params.address_id}*/}
        {/*/>*/}
        <AtForm
          onSubmit={this.handleSubmit}
        >
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
              onClick={this.handleClickPicker}
              onChange={this.bindMultiPickerChange}
              onColumnChange={this.bindMultiPickerColumnChange}
              value={multiIndex}
              range={areaList}
            >
              <View className='picker'>
                <View className='picker__title'>所在区域</View>
                {
                  info.address_id || (this.$router.params.isWechatAddress && info.province)
                    ? `${info.province}${info.city}${info.county}`
                    : <View>
                      {
                        multiIndex.length > 0
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
                onChange={this.handleDefChange.bind(this)}
              />
            </SpCell>
          </View>

          <View className='btns'>
            {
              process.env.TARO_ENV === 'weapp'
                ? <Button
                    type='primary'
                    onClick={this.handleSubmit}
                    formType='submit'
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                    >提交</Button>
                : <Button
                    type='primary'
                    onClick={this.handleSubmit}
                    formType='submit'
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                    >提交</Button>
            }
          </View>
        </AtForm>

        <SpToast />
      </View>

    )
  }
}
