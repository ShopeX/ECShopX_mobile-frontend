import Taro, { Component } from '@tarojs/taro'
// import EditAddress from '@/components/new-address/edit-address'
import { View, Switch, Text, Picker, Button } from '@tarojs/components'
import { AtForm, AtInput } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { SpCell, SpToast, NavBar } from '@/components'
import api from '@/api' 
import { pickBy,isWeixin, isAlipay, showLoading, hideLoading } from '@/utils'
import S from '@/spx'

import './edit-address.scss' 

//转换属性
const traverseData = (data) => {
  let item = [];
  data.forEach(d => {
    let newData = {};
    newData.name = d.label;
    if (d.children) {
      newData.subList = traverseData(d.children);
    }
    item.push(newData)
  })
  return item;
}

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class AddressIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: {},
      areaList: [],
      multiIndex: [],
      listLength: 0,
      areaListAli: [],
      selectedListAli: []
      // ubmitLoading: false,
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    showLoading()
    const { list } = await api.member.addressList()
    this.setState({
      listLength: list.length
    })

    list.map(a_item => {
      if (a_item.address_id === this.$router.params.address_id) {
        this.setState({
          info: a_item
        })
      }
    })

    let res = await api.member.areaList();

    if (isAlipay) {
      this.setState({
        areaListAli: traverseData(res)
      })
    }

    if (isWeixin) {
      const nList = pickBy(res, {
        label: 'label',
        children: 'children',
      })
      console.log("---api.member.areaList2---", nList);
      this.nList = nList
      let arrProvice = []
      let arrCity = []
      let arrCounty = []
      nList.map((item, index) => {
        arrProvice.push(item.label)
        if (index === 0) {
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if (c_index === 0) {
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

      if (this.$router.params.isWechatAddress) {
        const resAddress = await Taro.chooseAddress()
        const query = {
          province: resAddress.provinceName,
          city: resAddress.cityName,
          county: resAddress.countyName,
          adrdetail: resAddress.detailInfo,
          is_def: 0,
          postalCode: resAddress.postalCode,
          telephone: resAddress.telNumber,
          username: resAddress.userName,
        }
        this.setState({
          info: query
        })
      }
    }




    hideLoading()
  }

  // 选定开户地区
  handleClickPicker = () => {
    let arrProvice = []
    let arrCity = []
    let arrCounty = []
    if (this.nList) {
      this.nList.map((item, index) => {
        arrProvice.push(item.label)
        if (index === 0) {
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if (c_index === 0) {
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
      if (index === e.detail.value[0]) {
        info.province = item.label
        item.children.map((s_item, sIndex) => {
          if (sIndex === e.detail.value[1]) {
            info.city = s_item.label
            s_item.children.map((th_item, thIndex) => {
              if (thIndex === e.detail.value[2]) {
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
    if (e.detail.column === 0) {
      this.setState({
        multiIndex: [e.detail.value, 0, 0]
      })
      this.nList.map((item, index) => {
        if (index === e.detail.value) {
          let arrCity = []
          let arrCounty = []
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if (c_index === 0) {
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
      }, () => {
        this.nList[multiIndex[0]].children.map((c_item, c_index) => {
          if (c_index === e.detail.value) {
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
    const { value } = e.detail || {}
    const { selectedListAli } = this.state
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

    if (!data.province) {
      data.province = selectedListAli[0]
      data.city = selectedListAli[1]
      data.county = selectedListAli[2]
    }

    if (!data.adrdetail) {
      return S.toast('请输入详细地址')
    }

    showLoading({
      title: '正在提交',
      mask: true
    })

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
      hideLoading()
      return false
    }
    hideLoading()
  }

  handleSelectArea = () => {
    const { areaListAli } = this.state;
    console.log("--areaList--", areaListAli)
    my.multiLevelSelect({
      title: '请选择省市县区域',
      list: areaListAli,
      success: (res) => {
        console.log("----handleSelectArea---", res.result)
        this.setState({
          selectedListAli: [res.result[0].name, res.result[1].name, res.result[2].name]
        })
      }
    })
  }

  render() {
    const { colors } = this.props
    const { info, multiIndex, selectedListAli } = this.state

    return (
      <View className='page-address-edit'>

        {/*<EditAddress*/}
        {/*address={this.$router.params.address}*/}
        {/*addressID={this.$router.params.address_id}*/}
        {/*/>*/}
        <NavBar
          title='编辑地址'
          leftIconType='chevron-left'
          fixed='true'
        />
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

            {
              isAlipay && <View className='picker' onClick={this.handleSelectArea}>
                <View className='picker__title' >所在区域</View>
                {
                  selectedListAli.length && <Text>{`${selectedListAli[0]}${selectedListAli[1]}${selectedListAli[2]}`}</Text>
                }</View>
            }

            {
              isWeixin && <Picker
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
            }

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
                >
                  提交
                </Button>
                : <Button
                  type='primary'
                  // onClick={this.handleSubmit}
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
