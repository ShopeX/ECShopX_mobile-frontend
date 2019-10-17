import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Image } from '@tarojs/components'
import { connect } from "@tarojs/redux";
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpToast, Timer, NavBar, FormIdCollector, SpCheckbox } from '@/components'
import { classNames, isString, isArray } from '@/utils'
import S from '@/spx'
import api from '@/api'

import './reg.scss'

const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

@connect(( { user } ) => ({
  land_params: user.land_params
}), () => ({}))
export default class Reg extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      isVisible: false,
      list: [],
      imgVisible: false,
      imgInfo: {},
      isHasValue: false,
      option_list: [],
      showCheckboxPanel: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    // console.log(Taro.getEnv(),this.props.land_params)
    if ( process.env.TARO_ENV === 'weapp') {
      this.setState({
        info: {
          user_type: 'wechat'
        }
      })
    }else {
      this.setState({
        info: {
          user_type: 'local',
          uid: this.props.land_params ? this.props.land_params.user_id : ''
        }
      })
    }
    this.fetch()
  }

  handleClickImgcode = async () => {
    const query = {
      type: 'sign'
    }
    try {
      const img_res = await api.user.regImg(query)
      this.setState({
        imgInfo: img_res
      })
    } catch (error) {
      console.log(error)
    }
  }

  async fetch () {
    let arr  = []
    let res = await api.user.regParam()
    console.log(res)
    Object.keys(res).forEach(key => {
      if(res[key].is_open) {
        if(key === 'sex'){
          res[key].items = ['未知', '男', '女']
        }
        if(key === 'birthday'){
          res[key].items = []
        }
        arr.push({
          key: key,
          element_type: res[key].element_type,
          name: res[key].name,
          is_required: res[key].is_required,
          items: res[key].items ? res[key].items : null
        })
      }
    })

    if (!isWeapp) {
      this.handleClickImgcode()
    }

    this.setState({
      list: arr
    });
    this.count = 0
  }

  handleSubmit = async (e) => {
    const { value } = e.detail
    const data = {
      ...this.state.info,
      ...value
    }

    if (!data.mobile || !/1\d{10}/.test(data.mobile)) {
      return S.toast('请输入正确的手机号')
    }

    if (!isWeapp && !data.vcode) {
        return S.toast('请输入验证码')
      }

    /*if (!data.password) {
      return S.toast('请输入密码')
    }*/
    this.state.list.map(item=>{
      return item.is_required ? (item.is_required && data[item.key] ? true : S.toast(`请输入${item.name}`)) : null
    })

    try {
      if (isWeapp) {
        const uid = Taro.getStorageSync('distribution_shop_id')
        const { union_id, open_id } = this.$router.params
        let params = {
          ...data,
          user_type: 'wechat',
          auth_type: 'wxapp',
          union_id,
          open_id
        }
        if (uid) {
          Object.assign(params, {uid})
        }
        const res = await api.user.reg(params)

        const { code } = await Taro.login()
        const { token } = await api.wx.login({ code })
        S.setAuthToken(token)
      } else {
        const res = await api.user.reg(data)
        S.setAuthToken(res.token)
      }

      S.toast('注册成功')
      setTimeout(()=>{
        Taro.redirectTo({
          url: '/pages/member/index'
        })
      }, 700)
    } catch (error) {
      return false
      console.log(error)
    }
  }

  handleChange = (name, val) => {
    const { info, list } = this.state
    info[name] = val
    if(name === 'mobile') {
      if(val.length === 11 && this.count === 0) {
        this.count = 1
        this.setState({
          imgVisible: true
        })
      }
    }
    
    if(!isString(val) && !isArray(val)) {
      list.map(item => {
        item.key === name ? info[name] = val.detail.value : null
        if(name === 'birthday') {
          item.key === name ? item.value = val.detail.value : null
        } else {
          item.key === name ? (item.items ? item.value = item.items[val.detail.value] : item.value = val.detail.value) : null
        }
      })
    } else if(isArray(val)) {
      list.map(item => {
        let new_option_list = []
        val.map(option_item => {
          if(option_item.ischecked === true) {
            new_option_list.push(option_item.name)
          }
        })
        item.key === name ? item.value = new_option_list.join("，") : null
      })
    } else {
      list.map(item => {
        item.key === name ? item.value = val : null
      })
    }
    this.setState({ list })
  }

  handleClickIconpwd = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    });
  }

  handleErrorToastClose = () => {
    S.closeToast()
  }

  handleTimerStart = async (resolve) => {
    if (this.state.isTimerStart) return
    const { mobile, yzm } = this.state.info
    const { imgInfo } = this.state
    if (!/1\d{10}/.test(mobile)) {
      return S.toast('请输入正确的手机号')
    }
    if(!(mobile.length === 11 && yzm)) {
      return S.toast('请输入手机号和图形验证码')
    }

    const query = {
      type: 'sign',
      mobile: mobile,
      yzm: yzm,
      token: imgInfo.imageToken
    }
    try {
      await api.user.regSmsCode(query)
      S.toast('发送成功')
    } catch (error) {
      return false
      console.log(error)
    }

    resolve()
  }


  handleTimerStop = () => {

  }

  handleClickAgreement = () => {
    Taro.navigateTo({
      url: '/pages/auth/reg-rule'
    })
  }

  handleBackHome = () => {
    Taro.redirectTo({
      url: '/pages/index'
    })
  }

  handleGetPhoneNumber = async (e) => {
    // let { code } = this.$router.params
    // try {
    //   await Taro.checkSession()
    // } catch (e) {
    //   code = null
    // }

    // if (!code) {
    //   const codeRes = await Taro.login()
    //   code = codeRes.code
    // }
    const { code } = await Taro.login()
    const { errMsg, ...params } = e.detail
    if (errMsg.indexOf('fail') >= 0) {
      return
    }
    params.code = code
    const { phoneNumber } = await api.wx.decryptPhone(params)
    this.handleChange('mobile', phoneNumber)
    this.setState({
      isHasValue: true
    })
  }

  handleBackHome = () => {
    Taro.redirectTo({
      url: '/pages/index'
    })
  }

  showCheckboxPanel = (options, type) => {
    this.setState({
      option_list: options,
      showCheckboxPanel: true
    })
    this.type = type
  }

  // 多选结果确认
  btnClick = (btn_type) => {
    this.setState({
      showCheckboxPanel: false
    })
    const { option_list } = this.state
    if(btn_type === 'cancel') {
      // let new_type = this.type
      option_list.map(item => {
        item.ischecked = false
      })
    } 
    this.handleChange(this.type, option_list)
  }

  handleSelectionChange = (name) => {
    const { option_list } = this.state
    option_list.map(item => {
      if(item.name === name) {
        item.ischecked = !item.ischecked
      }
    })
    this.setState({
      option_list
    })
  }

  render () {
    const { info, isVisible, isHasValue, list, imgVisible, imgInfo, option_list, showCheckboxPanel } = this.state

    return (
      <View className='auth-reg'>
        <NavBar
          title='注册'
          leftIconType='chevron-left'
        />
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec auth-reg__form'>
            {process.env.TARO_ENV === 'weapp' && (
              <View className='at-input'>
                <View className='at-input__container'>
                  <View className='at-input__title'>手机号码</View>
                  <View className='at-input__input'>{info.mobile}</View>
                  <View className='at-input__children'>
                    <AtButton
                      openType='getPhoneNumber'
                      onGetPhoneNumber={this.handleGetPhoneNumber}
                    >获取手机号码</AtButton>
                  </View>
                </View>
              </View>

              // <AtInput
              //   title='手机号码'
              //   className='input-phone'
              //   name='mobile'
              //   type='number'
              //   // disabled={isHasValue}
              //   maxLength={11}
              //   value={info.mobile}
              //   placeholder=''
              //   onFocus={this.handleErrorToastClose}
              //   onChange={this.handleChange.bind(this, 'mobile')}
              // >
              //   <AtButton
              //     openType='getPhoneNumber'
              //     onGetPhoneNumber={this.handleGetPhoneNumber}
              //   >获取手机号码</AtButton>
              // </AtInput>
            )}
            {Taro.getEnv() !== Taro.ENV_TYPE.WEAPP && (
              <View>
                <AtInput
                  title='手机号码'
                  name='mobile'
                  type='number'
                  maxLength={11}
                  value={info.mobile}
                  placeholder='请输入手机号码'
                  onFocus={this.handleErrorToastClose}
                  onChange={this.handleChange.bind(this, 'mobile')}
                />
                {
                  imgVisible
                    ? <AtInput title='图片验证码' name='yzm' value={info.yzm} placeholder='请输入图片验证码' onFocus={this.handleErrorToastClose} onChange={this.handleChange.bind(this, 'yzm')}>
                      <Image src={`${imgInfo.imageData}`} onClick={this.handleClickImgcode} />
                    </AtInput>
                    : null
                }
                <AtInput
                  title='验证码'
                  name='vcode'
                  value={info.vcode}
                  placeholder='请输入验证码'
                  onFocus={this.handleErrorToastClose}
                  onChange={this.handleChange.bind(this, 'vcode')}
                >
                  <Timer
                    onStart={this.handleTimerStart}
                    onStop={this.handleTimerStop}
                  />
                </AtInput>
              </View>
            )}
            {/*<AtInput
              title='密码'
              name='password'
              type={isVisible ? 'text' : 'password'}
              value={info.password}
              placeholder='请输入密码'
              autocomplete='new-password'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'password')}
            >
              {
                isVisible
                  ? <View className='sp-icon sp-icon-yanjing icon-pwd' onClick={this.handleClickIconpwd}> </View>
                  : <View className='sp-icon sp-icon-icon6 icon-pwd' onClick={this.handleClickIconpwd}> </View>
              }
            </AtInput>*/}
            {
              list.map((item, index) => {
                return (
                  <View key={index}>
                    {
                      item.element_type === 'input'
                        ? <View key={index}>
                            <AtInput
                              key={index}
                              title={item.name}
                              name={`${item.key}`}
                              placeholder={`请输入${item.name}`}
                              value={item.value}
                              onFocus={this.handleErrorToastClose}
                              onChange={this.handleChange.bind(this, `${item.key}`)}
                              ref={(input) => { this.textInput = input }}
                            />
                          </View>
                        : null
                    }
                    {
                      item.element_type === 'select'
                        ? <View className='page-section'>
                            <View key={index}>
                              {
                                item.key === 'birthday'
                                  ? <Picker mode='date' onChange={this.handleChange.bind(this, `${item.key}`)}>
                                    <View className='picker'>
                                      <View className='picker__title'>{item.name}</View>
                                      <Text
                                        className={classNames(item.value ? 'pick-value' : 'pick-value-null')}
                                      >{item.value ? item.value : `请选择${item.name}`}</Text>
                                    </View>
                                  </Picker>
                                  : <Picker mode='selector' range={item.items} key={index} data-item={item} onChange={this.handleChange.bind(this, `${item.key}`)}>
                                    <View className='picker'>
                                      <View className='picker__title'>{item.name}</View>
                                      <Text
                                        className={classNames(item.value ? 'pick-value' : 'pick-value-null')}
                                      >{item.value ? item.value : `请选择${item.name}`}</Text>
                                    </View>
                                  </Picker>
                              }
                            </View>
                          </View>
                        : null
                    }
                    {
                      item.element_type === 'checkbox'
                        ? <View className='page-section'>
                            <AtInput
                              key={index}
                              title={item.name}
                              name={`${item.key}`}
                              placeholder={`请选择${item.name}`}
                              value={item.value}
                              onFocus={this.showCheckboxPanel.bind(this, item.items, item.key)}
                            />
                          </View>
                        : null
                    }
                  </View>
                )
              })

            }
          </View>
          <View className='btns'>
            {
              process.env.TARO_ENV === 'weapp'
                ? <FormIdCollector
                  sync
                >
                    <AtButton className='submit-btn' type='primary' formType='submit'>同意协议并注册</AtButton>
                    <AtButton type='default' onClick={this.handleBackHome.bind(this)}>暂不注册，随便逛逛</AtButton>
                  </FormIdCollector>
                : <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>同意协议并注册</AtButton>
            }
            <View className='accountAgreement'>
              已阅读并同意
              <Text
                className='accountAgreement__text'
                onClick={this.handleClickAgreement.bind(this)}
              >
                《用户协议》
              </Text>
            </View>
          </View>
        </AtForm>
        {
          showCheckboxPanel 
            ? <View className='checkBoxPanel'>
                <View className='checkBoxPanel-content'>
                  {
                    option_list.map((item, index) => {
                      return (
                        <View 
                          className='checkBoxPanel-item'
                          key={index}
                        >
                          <SpCheckbox
                            checked={item.ischecked}
                            onChange={this.handleSelectionChange.bind(this, item.name)}
                          >{item.name}</SpCheckbox>
                        </View>
                      )
                    })
                  }
                </View>
                <View className='panel-btns'>
                  <View className='panel-btn cancel-btn' onClick={this.btnClick.bind(this, 'cancel')}>取消</View>
                  <View className='panel-btn require-btn' onClick={this.btnClick.bind(this, 'require')}>确定</View>
                </View>
              </View>   
          : null
        }                  
        <SpToast />                  
      </View>
    )
  }
}
