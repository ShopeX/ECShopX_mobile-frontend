import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Form, Button, Text, Picker, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtInput, AtButton } from 'taro-ui'
import { SpToast, SpTimer, SpNavBar, SpCheckbox, AccountOfficial } from '@/components'
import { classNames, isString, isArray, tokenParse,getBrowserEnv, isWeb } from '@/utils'
// import { Tracker } from '@/service'
import S from '@/spx'
import api from '@/api'

import './reg.scss'

const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

@connect(
  ({ user, colors }) => ({
    land_params: user.land_params,
    colors: colors.current
  }),
  () => ({})
)
export default class Reg extends Component {
  $instance = getCurrentInstance();
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
      showCheckboxPanel: false,
      isHasData: true,
      show_official: false,
      show_kuangkuang: true
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    // console.log(Taro.getEnv(),this.props.land_params)
    if (process.env.TARO_ENV === 'weapp') {
      this.setState({
        info: {
          user_type: 'wechat'
        }
      })
    } else {
      this.setState({
        info: {
          user_type: 'local',
          uid: this.props.land_params ? this.props.land_params.user_id : ''
        }
      })
    }

    this.fetch()
  }
  componentDidShow () {
    this.checkWhite()
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
    let arr = []
    let res = await api.user.regParam()
    console.log(res)
    if (!res) {
      this.setState({
        isHasData: false
      })
    } else {
      Object.keys(res).forEach((key) => {
        if (res[key].is_open) {
          if (key === 'sex') {
            res[key].items = ['未知', '男', '女']
          }
          if (key === 'birthday') {
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
      this.setState({
        list: arr,
        isHasData: true
      })
    }

    if (!isWeapp) {
      this.handleClickImgcode()
    }
    this.count = 0
  }
  async checkWhite () {
    const { status } = await api.wx.getWhiteList()
    if (status == true) {
      setTimeout(() => {
        this.setState({
          show_kuangkuang: false
        })
        //Taro.hideHomeButton()
      }, 1000)
    }
  }

  handleSubmit = async (e) => { 
    const { value } = e.detail
    let contine = false
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

    if (!data.password) {
      return S.toast('请输入密码')
    }
    this.state.list.map((item) => {
      if (item.is_required && !data[item.key]) {
        contine = true
        return S.toast(`请输入${item.name}`)
      }
      //return item.is_required ? (item.is_required && data[item.key] ? true : S.toast(`请输入${item.name}`)) : null
    })
    if (contine) {
      return false
    }

    try {
      let res = null
      if (isWeapp) {
        const uid = Taro.getStorageSync('distribution_shop_id')
        const { union_id, open_id } = this.$instance.router.params
        const trackParams = Taro.getStorageSync('trackParams')
        let params = {
          ...data,
          user_type: 'wechat',
          auth_type: 'wxapp',
          union_id,
          open_id
        }
        if (uid) {
          Object.assign(params, { uid })
        }
        if (trackParams) {
          Object.assign(params, {
            source_id: trackParams.source_id,
            monitor_id: trackParams.monitor_id
          })
        }

        // 导购id
        let salesperson_id = Taro.getStorageSync('s_smid')
        if (salesperson_id) {
          params.distributor_id = Taro.getStorageSync('s_dtid')
          params.salesperson_id = salesperson_id
        }

        // 新导购信息处理
        const work_userid = Taro.getStorageSync('work_userid')

        if (work_userid) {
          params.channel = 1
          params.work_userid = work_userid
        }

        res = await api.user.reg(params)
        Tracker.dispatch('MEMBER_REG', params)

        const { code } = await Taro.login()
        const { token } = await api.wx.login({ code })

        S.setAuthToken(token)
        try {
          await api.wx.newMarketing()
        } catch (e) {
          console.error(e)
        }
        // 通过token解析openid
        if (token) {
          const userInfo = tokenParse(token)
          Tracker.setVar({
            user_id: userInfo.user_id,
            open_id: userInfo.openid,
            union_id: userInfo.unionid
          })
        }
      } else {
        res = await api.user.reg(data)
        S.setAuthToken(res.token)
      }

      try {
        let salesperson_id = Taro.getStorageSync('s_smid')

        if (salesperson_id) {
          await api.member.setUsersalespersonrel({
            salesperson_id
          })
        }
      } catch (err) {
        Taro.showToast({
          title: '导购员绑定失败',
          icon: 'none',
          duration: 2000
        })
      }
      if (res && res.token) {
        S.toast('注册成功')
        const { redirect, source } = this.$instance.router.params
        setTimeout(() => {
          if (Taro.getStorageSync('isqrcode') === 'true') {
            Taro.redirectTo({
              url: '/subpage/pages/qrcode-buy'
            })
          } else if (source === 'other_pay') {
            Taro.redirectTo({
              url: `/pages/cart/espier-checkout?source=${source}`
            })
          } else {
            // 如果返回
            if (redirect) {
              Taro.redirectTo({
                url: decodeURIComponent(redirect)
              })
            } else {
              Taro.redirectTo({
                url: "/subpages/member/index"
              });
            }
          }
        }, 700)
      } else {
        S.toast(res.message)
      }
    } catch (error) {
      return false
    }
  }

  handleChange = (name, val) => {
    const { info, list } = this.state
    info[name] = val
    if (name === 'mobile') {
      if (val.length === 11 && this.count === 0) {
        this.count = 1
        this.setState({
          imgVisible: true
        })
      }
    }

    if (!isString(val) && !isArray(val)) {
      list.map((item) => {
        item.key === name ? (info[name] = val.detail.value) : null
        if (name === 'birthday') {
          item.key === name ? (item.value = val.detail.value) : null
        } else {
          item.key === name
            ? item.items
              ? (item.value = item.items[val.detail.value])
              : (item.value = val.detail.value)
            : null
        }
      })
    } else if (isArray(val)) {
      list.map((item) => {
        let new_option_list = []
        val.map((option_item) => {
          if (option_item.ischecked === true) {
            new_option_list.push(option_item.name)
          }
        })
        item.key === name ? (item.value = new_option_list.join('，')) : null
      })
    } else {
      list.map((item) => {
        item.key === name ? (item.value = val) : null
      })
    }
    this.setState({ list })
  }

  handleClickIconpwd = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible
    })
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
    if (!(mobile.length === 11 && yzm)) {
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
    }

    resolve()
  }

  handleTimerStop = () => {}

  handleClickAgreement = () => {
    Taro.navigateTo({
      url: '/subpage/pages/auth/reg-rule'
    })
  }

  handleBackHome = () => {
    Taro.redirectTo({
      url: '/pages/index'
    })
  }

  handleGetPhoneNumber = async (e) => {
    // let { code } = getCurrentInstance().params
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
    if (btn_type === 'cancel') {
      // let new_type = this.type
      option_list.map((item) => {
        item.ischecked = false
      })
    }
    this.handleChange(this.type, option_list)
  }

  handleSelectionChange = (name) => {
    const { option_list } = this.state
    option_list.map((item) => {
      if (item.name === name) {
        item.ischecked = !item.ischecked
      }
    })
    this.setState({
      option_list
    })
  }
  handleOfficialError = () => {}
  handleOfficialClose = () => {
    this.setState({
      show_official: false
    })
  }

  render () {
    const { colors } = this.props
    const {
      info, 
      isVisible,
      isHasData,
      list,
      imgVisible,
      imgInfo,
      option_list,
      showCheckboxPanel,
      show_official,
      show_kuangkuang
    } = this.state;

    return (
      <View className={classNames('auth-reg',{'inWeixin':getBrowserEnv().weixin})}>
        {show_official && (
          <AccountOfficial
            onHandleError={this.handleOfficialError.bind(this)}
            onClick={this.handleOfficialClose.bind(this)}
          />
        )}
        <SpNavBar title='注册' leftIconType='chevron-left' />
        <Form onSubmit={this.handleSubmit}>
          <View className='sec auth-reg__form'>
            {process.env.TARO_ENV === 'weapp' && (
              <View className='at-input'>
                <View className='at-input__container'>
                  <View className='at-input__title'>
                    <Text className='require-text'>*</Text>手机号码
                  </View>
                  <View className='at-input__input'>{info.mobile}</View>
                  <View className='at-input__children'>
                    <AtButton
                      openType='getPhoneNumber'
                      onGetPhoneNumber={this.handleGetPhoneNumber}
                    >
                      获取手机号码
                    </AtButton>
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
                  required
                  title='手机号码'
                  name='mobile'
                  type='number'
                  maxLength={11}
                  value={info.mobile}
                  placeholder='请输入手机号码'
                  onFocus={this.handleErrorToastClose}
                  onChange={this.handleChange.bind(this, 'mobile')}
                />
                {imgVisible ? (
                  <AtInput
                    title='图片验证码'
                    required
                    name='yzm'
                    value={info.yzm}
                    placeholder='请输入图片验证码'
                    onFocus={this.handleErrorToastClose}
                    onChange={this.handleChange.bind(this, 'yzm')}
                  >
                    <Image className='code-imgs' src={`${imgInfo.imageData}`} onClick={this.handleClickImgcode} />
                  </AtInput>
                ) : null}
                <AtInput
                  title='验证码'
                  required
                  name='vcode'
                  value={info.vcode}
                  placeholder='请输入验证码'
                  onFocus={this.handleErrorToastClose}
                  onChange={this.handleChange.bind(this, 'vcode')}
                >
                  <SpTimer onStart={this.handleTimerStart} onStop={this.handleTimerStop} />
                </AtInput>
              </View>
            )}

            <AtInput
              title='密码'
              name='password'
              type={isVisible ? 'text' : 'password'}
              value={info.password}
              placeholder='请输入密码'
              required
              autocomplete='new-password'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'password')}
            >
              {
                isVisible
                  ? <View className='sp-icon sp-icon-yanjing icon-pwd' onClick={this.handleClickIconpwd}> </View>
                  : <View className='sp-icon sp-icon-icon6 icon-pwd' onClick={this.handleClickIconpwd}> </View>
              }
            </AtInput>
            {isHasData &&
              list.map((item, index) => {
                return (
                  <View key={`${index}1`}>
                    {item.element_type === 'input' ? (
                      <View key={`${index}1`}>
                        <AtInput
                          required={item.is_required}
                          key={`${index}1`}
                          title={item.name}
                          name={`${item.key}`}
                          placeholder={`请输入${item.name}`}
                          value={item.value}
                          onFocus={this.handleErrorToastClose}
                          onChange={this.handleChange.bind(this, `${item.key}`)}
                          ref={(input) => {
                            this.textInput = input
                          }}
                        />
                      </View>
                    ) : null}
                    {item.element_type === 'select' ? (
                      <View className='page-section'>
                        <View key={`${index}1`}>
                          {item.key === 'birthday' ? (
                            <Picker
                              mode='date'
                              onChange={this.handleChange.bind(this, `${item.key}`)}
                            >
                              <View className='picker'>
                                <View className='picker__title'>
                                  {item.is_required && <Text className='require-text'>*</Text>}
                                  {item.name}
                                </View>
                                <Text
                                  className={classNames(
                                    item.value ? 'pick-value' : 'pick-value-null'
                                  )}
                                >
                                  {item.value ? item.value : `请选择${item.name}`}
                                </Text>
                              </View>
                            </Picker>
                          ) : (
                            <Picker
                              mode='selector'
                              range={item.items}
                              key={`${index}1`}
                              data-item={item}
                              onChange={this.handleChange.bind(this, `${item.key}`)}
                            >
                              <View className='picker'>
                                <View className='picker__title'>
                                  {item.is_required && <Text className='require-text'>*</Text>}
                                  {item.name}
                                </View>
                                <Text
                                  className={classNames(
                                    item.value ? 'pick-value' : 'pick-value-null'
                                  )}
                                >
                                  {item.value ? item.value : `请选择${item.name}`}
                                </Text>
                              </View>
                            </Picker>
                          )}
                        </View>
                      </View>
                    ) : null}
                    {item.element_type === 'checkbox' ? (
                      <View className='page-section'>
                        <AtInput
                          required={item.is_required}
                          key={`${index}1`}
                          title={item.name}
                          name={`${item.key}`}
                          placeholder={`请选择${item.name}`}
                          value={item.value}
                          onFocus={this.showCheckboxPanel.bind(this, item.items, item.key)}
                        />
                      </View>
                    ) : null}
                  </View>
                )
              })}
          </View>
          <View className='btns'>
            {process.env.TARO_ENV === 'weapp' ? (
              <View>
                <Button
                  className='submit-btn'
                  type='primary'
                  formType='submit'
                  style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                >
                  同意协议并注册
                </Button>
                {show_kuangkuang ? (
                  <AtButton type='default' onClick={this.handleBackHome.bind(this)}>
                    暂不注册，随便逛逛
                  </AtButton>
                ) : (
                  ''
                )}
              </View>
            ) : (
              <Button
                type='primary'
                formType='submit'
                style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
              >
                同意协议并注册
              </Button>
            )}
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
        </Form>
        {showCheckboxPanel ? (
          <View className='checkBoxPanel'>
            <View className='checkBoxPanel-content'>
              {option_list.map((item, index) => {
                return (
                  <View className='checkBoxPanel-item' key={`${index}1`}>
                    <SpCheckbox
                      checked={item.ischecked}
                      onChange={this.handleSelectionChange.bind(this, item.name)}
                    >
                      {item.name}
                    </SpCheckbox>
                  </View>
                )
              })}
            </View>
            <View className='panel-btns'>
              <View className='panel-btn cancel-btn' onClick={this.btnClick.bind(this, 'cancel')}>
                取消
              </View>
              <View
                className='panel-btn require-btn'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.btnClick.bind(this, 'require')}
              >
                确定
              </View>
            </View>
          </View>
        ) : null}
        <SpToast />
      </View>
    )
  }
}
