import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtInput, AtCheckbox, AtFloatLayout, AtTextarea } from 'taro-ui'
import { SpToast, SpCheckbox } from '@/components'
import api from '@/api'
import { pickBy, classNames } from '@/utils'
import S from '@/spx'

import './goods-reservate.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

@withPager
@withBackToTop
export default class GoodsReservate extends Component {
  constructor (props) {
    super(props)

    this.state = {
      cur_activity_info: '',
      isHasActivityInfo: true,
      option_list: [],
      showCheckboxPanel: false,
      checkedList: [],
      confirm_list: [],
      areaList: [],
      multiIndex: [],
      isShowSubTips: false
    }
  }

  componentDidShow () {
    this.count = 0
    this.fetch()
  }

  async fetch () {
    const { activity_info } = await api.user.registrationActivity({activity_id: this.$router.params.activity_id})
    if(!activity_info){
      this.setState({
        isHasActivityInfo: false
      })
    } else {
      this.setState({
        cur_activity_info: activity_info,
      })
    }
    this.getAreaData()
  }

  getAreaData = async () => {
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
    },()=>{
      this.setState({
        multiIndex: [0, 0, 0]
      })
    })
  }

  // 选定开户地区
  bindMultiPickerChange = async (name, e) => {
    let selectd_area = []
    this.nList.map((item, index) => {
      if(index === e.detail.value[0]) {
        selectd_area[0] = item.label
        item.children.map((s_item,sIndex) => {
          if(sIndex === e.detail.value[1]) {
            selectd_area[1] = s_item.label
            s_item.children.map((th_item,thIndex) => {
              if(thIndex === e.detail.value[2]) {
                selectd_area[2] = th_item.label
              }
            })
          }
        })
      }
    })

    this.handleCell(name, selectd_area)
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


  handleCell = (name, e) => {
    const { cur_activity_info } = this.state
    cur_activity_info && cur_activity_info.formdata.content.map(item => {
      if(item.formdata && item.formdata.length > 0) {
        item.formdata.map(sec_item => {
          if(sec_item.field_name === name) {
            if(sec_item.options) {
              if(sec_item.form_element === 'checkbox') {
                let new_answer = [].concat(e)
                sec_item.answer = new_answer
              } else if(sec_item.form_element === 'select' || sec_item.form_element === 'radio'){
                sec_item.answer = sec_item.options[e.detail.value].value
              }
            } else {
              if(sec_item.form_element === 'date' || sec_item.form_element === 'time' || sec_item.form_element === 'textarea') {
                sec_item.answer = e.detail.value
              } else if(sec_item.form_element === 'area') {
                sec_item.answer = e
              }else if(sec_item.form_element === 'text' || sec_item.form_element === 'number') {
                sec_item.answer = e
              }
            }
          }
        })
      }
    })
    this.setState({
      cur_activity_info: cur_activity_info
    })
  }

  handleReservate = async () => {
    if(this.count === 1) {
      return S.toast('请勿重复提交')
    }
    this.count = 1

    let _this=this
    let templeparams = {
      'temp_name': 'yykweishop',
      'source_type': 'activity',
    }
    api.user.newWxaMsgTmpl(templeparams).then(tmlres => {
      console.log('templeparams---1', tmlres)
      if (tmlres.template_id && tmlres.template_id.length > 0) {
        wx.requestSubscribeMessage({
          tmplIds: tmlres.template_id,
          success() {
            _this.handleSubmit()
          },
          fail(){
            _this.handleSubmit()
          }
        })
      } else {
        _this.handleSubmit()
      }
    },()=>{
      _this.handleSubmit()
    })
  }

  handleSubmit = async () =>{
    let new_subdata = this.state.cur_activity_info
    if(new_subdata.formdata && new_subdata.formdata.content) {
      new_subdata.formdata.content = JSON.stringify(new_subdata.formdata.content)
    }
    try {
      await api.user.registrationSubmit(new_subdata)
      this.setState({
        isShowSubTips: true
      })
      if(new_subdata.formdata && new_subdata.formdata.content) {
        new_subdata.formdata.content = JSON.parse(new_subdata.formdata.content)
      }
    }catch(e) {
      console.log(e, 53)
    }
  }

  handleToList = () => {
    Taro.redirectTo({
      url: '/marketing/pages/member/item-activity'
    })
  }

  handleback  = () => {
    Taro.navigateBack()
  }

  showCheckbox = (options, type) => {
    options.map(item => {
      item.label = item.value
    })
    this.setState({
      option_list: options,
      showCheckboxPanel: true
    })
    this.type = type
  }

  handleSelectionChange = (value) => {
    this.setState({
      checkedList: value
    })
  }

  // 多选结果确认
  btnClick = (btn_type) => {
    if(btn_type === 'cancel') {
      this.setState({
        checkedList: this.state.confirm_list
      })
    } else {
      this.setState({
        confirm_list: this.state.checkedList
      })

      this.handleCell(this.type, this.state.checkedList)
    }
    this.setState({
      showCheckboxPanel: false
    })

  }



  render () {
    const { colors } = this.props
    const { cur_activity_info, isHasActivityInfo, option_list, showCheckboxPanel, checkedList, multiIndex, areaList, isShowSubTips } = this.state
    // let new_activity_info = JSON.parse(cur_activity_info)
    const { formdata } = cur_activity_info
    console.log(formdata, 255)
    return (
      <View className='goods-reservate'>
        <View className='goods-reservate__storeinfo'>
          {
            isHasActivityInfo ? <Text className='goods-reservate__tip'>{formdata.header_title}</Text> : null
          }
          {
            formdata && formdata.content && formdata.content.map((item,index) => {
              return (
                <View className='goods-reservate__userinfo' key={index}>
                  {
                    item.formdata && item.formdata.length > 0
                      ? item.formdata.map((i_data, i_index) => {
                          return (
                            // eslint-disable-next-line react/jsx-key
                            <View key={i_index}>
                              {
                                i_data.form_element === 'select' || i_data.form_element === 'radio'
                                  ? <Picker mode='selector' range={i_data.options} rangeKey='value' onChange={this.handleCell.bind(this, i_data.field_name)}>
                                      <View className='picker'>
                                        <View className='picker__title'>
                                          <Text className='picker__title_name'>{i_data.field_title}</Text>
                                          <Text className='picker__title_value'>{i_data.answer ? i_data.answer : '请选择'}</Text>
                                        </View>
                                        <View className='pick-value'>
                                          <View className='sp-cell__ft-icon at-icon at-icon-chevron-right'></View>
                                        </View>
                                      </View>
                                    </Picker>
                                  : null
                              }
                              {
                                i_data.form_element === 'textarea'
                                  ? <AtTextarea
                                    value={i_data.answer}
                                    onChange={this.handleCell.bind(this, i_data.field_name)}
                                    maxLength={200}
                                    placeholder={i_data.field_title}
                                  />
                                  : null
                              }
                              {
                                i_data.form_element === 'date'
                                  ? <Picker mode='date' onChange={this.handleCell.bind(this, i_data.field_name)}>
                                      <View className='picker'>
                                        <View className='picker__title'>
                                          <Text className='picker__title_name'>{i_data.field_title}</Text>
                                          <Text className='picker__title_value'>{i_data.answer ? i_data.answer : '请选择'}</Text>
                                        </View>
                                        <View className='pick-value'>
                                          <View className='sp-cell__ft-icon at-icon at-icon-chevron-right'></View>
                                        </View>
                                      </View>
                                    </Picker>
                                  : null
                              }
                              {
                                i_data.form_element === 'area'
                                  ? <Picker
                                    mode='multiSelector'
                                    onChange={this.bindMultiPickerChange.bind(this, i_data.field_name)}
                                    onColumnChange={this.bindMultiPickerColumnChange.bind(this)}
                                    value={multiIndex}
                                    range={areaList}
                                  >
                                    <View className='picker'>
                                      <View className='picker__title'>{i_data.field_title}</View>
                                      {
                                        i_data.answer.length === 3 ? <Text>{areaList[0][multiIndex[0]]}{areaList[1][multiIndex[1]]}{areaList[2][multiIndex[2]]}</Text> : ''
                                      }
                                    </View>
                                  </Picker>
                                  : null
                              }
                              {
                                i_data.form_element === 'number'
                                  ? <AtInput
                                    className='goods-input'
                                    name={i_data.field_name}
                                    title={i_data.field_title}
                                    type='number'
                                    placeholder={`请输入${i_data.field_title}`}
                                    value={i_data.answer}
                                    onChange={this.handleCell.bind(this, i_data.field_name)}
                                  />
                                  :null
                              }
                              {
                                i_data.form_element === 'text'
                                  ? <AtInput
                                    className='goods-input'
                                    name={i_data.field_name}
                                    title={i_data.field_title}
                                    type='text'
                                    placeholder={`请输入${i_data.field_title}`}
                                    value={i_data.answer}
                                    onChange={this.handleCell.bind(this, i_data.field_name)}
                                  />
                                  :null
                              }
                              {
                                i_data.form_element === 'checkbox'
                                  ? <View className='checkbox-input' onClick={this.showCheckbox.bind(this, i_data.options, i_data.field_name)}>
                                      <Text className='checkbox-input__title'>{i_data.field_title}</Text>
                                      <Text>{(i_data.answer && i_data.answer.length > 0) ? i_data.answer.join(','): ''}</Text>
                                    </View>
                                  : null
                              }
                            </View>
                          )
                        })
                      : null
                  }
                </View>
              )
            })
          }
        </View>

        {
          isHasActivityInfo
            ? <View className='goods-reservate__statement'>
                <Text className='goods-reservate__statement_title'>声明：</Text>
                <Text>*{formdata.bottom_title}</Text>
              </View>
            : <View className='success-view'>
                <View className='success-view__content'>
                  <View className='success-view__title'>您已报名成功</View>
                  <View>您已报名成功，我们将对所有报名用户进行筛选，报名结果将在2个工作日内通过短信及微信服务消息通知您，请注意查收！</View>
                  <View className='success-view__btn' onClick={this.handleback.bind(this)}>我知道了</View>
                </View>
              </View>
        }
        {
          isHasActivityInfo
            ? <View
                className='goods-reservate__btn'
                onClick={this.handleReservate.bind(this)}
                style={`background: ${colors.data[0].primary}`}
                >确定预约</View>
            : null
        }
        {
          isShowSubTips
            ? <View className='success-view'>
                <View className='success-view__content'>
                  <Image src='/assets/imgs/ic_successed.png' mode='widthFix' className='success-view__img'></Image>
                  <View className='success-view__title'>您已报名成功</View>
                  <View>您已报名成功，我们将对所有报名用户进行筛选，报名结果将在2个工作日内通过短信及微信服务消息通知您，请注意查收！</View>
                  <View className='success-view__btn' onClick={this.handleToList.bind(this)}>我知道了</View>
                </View>
              </View>
            : null
        }
        <AtFloatLayout isOpened={showCheckboxPanel}>
          <AtCheckbox
            options={option_list}
            selectedList={checkedList}
            onChange={this.handleSelectionChange.bind(this)}
          />
          <View className='panel-btns'>
            <View className='panel-btn cancel-btn' onClick={this.btnClick.bind(this, 'cancel')}>取消</View>
            <View className='panel-btn require-btn' onClick={this.btnClick.bind(this, 'require')}>确定</View>
          </View>
        </AtFloatLayout>
        <SpToast />
      </View>
    )
  }
}
