/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Picker, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { $t, ti } from '@/i18n'
import { AtForm, AtButton } from 'taro-ui'
import { SpToast, SpNavBar, FormIdCollector, SpCheckbox, SpInput as AtInput } from '@/components'
import { SpTimer } from '@/subpages/components'
import { classNames, isString, isArray } from '@/utils'
import { Tracker } from '@/service'
import S from '@/spx'
import api from '@/api'
import './user-info.scss'

const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

class Reg extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
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
      isHasData: true
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.syncNavTitle()
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

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
      this.patchSexLabels()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('461de497.fe0e8b') })
  }

  patchSexLabels = () => {
    this.setState((state) => ({
      list: state.list.map((item) =>
        item.key === 'sex'
          ? {
              ...item,
              items: [$t('794b92c4.1622dc'), $t('1c487437.36a490'), $t('1c487437.87c835')]
            }
          : item
      )
    }))
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

  async fetch() {
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
            res[key].items = [$t('794b92c4.1622dc'), $t('1c487437.36a490'), $t('1c487437.87c835')]
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

  handleSubmit = async (e) => {
    const { value } = e.detail
    const data = {
      ...this.state.info,
      ...value
    }

    if (!data.mobile || !/1\d{10}/.test(data.mobile)) {
      return S?.toast($t('4e9d53b5.a32ab5'))
    }

    if (!isWeapp && !data.vcode) {
      return S?.toast($t('4e9d53b5.d0c06a'))
    }

    /*if (!data.password) {
      return S?.toast('请输入密码')
    }*/
    this.state.list.map((item) => {
      return item.is_required
        ? item.is_required && data[item.key]
          ? true
          : S?.toast(ti('b1a8838b.72ba91', [item.name]))
        : null
    })

    try {
      if (isWeapp) {
        const uid = Taro.getStorageSync('distribution_shop_id')
        const { union_id, open_id } = this.$instance?.router?.params
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
        const res = await api.user.reg(params)

        Tracker.dispatch('MEMBER_REG', params)

        const { code } = await Taro.login()
        const { token } = await api.wx.login({ code })
        S?.setAuthToken(token)
      } else {
        const res = await api.user.reg(data)
        S?.setAuthToken(res.token)
      }

      S?.toast($t('4e9d53b5.6506a9'))
      setTimeout(() => {
        Taro.redirectTo({
          url: '/subpages/member/index'
        })
      }, 700)
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
        item.key === name ? (item.value = new_option_list.join($t('5e103177.d3b98f'))) : null
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
    S?.closeToast()
  }

  handleTimerStart = async (resolve) => {
    if (this.state.isTimerStart) return
    const { mobile, yzm } = this.state.info
    const { imgInfo } = this.state
    if (!/1\d{10}/.test(mobile)) {
      return S?.toast($t('4e9d53b5.a32ab5'))
    }
    if (!(mobile.length === 11 && yzm)) {
      return S?.toast($t('5e103177.07bb27'))
    }

    const query = {
      type: 'sign',
      mobile: mobile,
      yzm: yzm,
      token: imgInfo.imageToken
    }
    try {
      await api.user.regSmsCode(query)
      S?.toast($t('1d9cdff5.9db9a7'))
    } catch (error) {
      return false
    }

    resolve()
  }

  handleTimerStop = () => {}

  handleClickAgreement = () => {
    Taro.navigateTo({
      url: '/subpages/auth/reg-rule'
    })
  }

  handleBackHome = () => {
    Taro.redirectTo({
      url: '/pages/index'
    })
  }

  handleGetPhoneNumber = async (e) => {
    // let { code } = getCurrentInstance()?.params
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

  render() {
    const {
      info,
      isHasValue,
      isVisible,
      isHasData,
      list,
      imgVisible,
      imgInfo,
      option_list,
      showCheckboxPanel
    } = this.state

    console.log('==list', list)

    return (
      <View className='auth-reg'>
        <SpNavBar title={$t('461de497.fe0e8b')} leftIconType='chevron-left' />
        <AtForm onSubmit={this.handleSubmit}>
          <View className='sec auth-reg__form'>
            {process.env.TARO_ENV === 'weapp' && (
              <View className='at-input'>
                <View className='at-input__container'>
                  <View className='at-input__title'>{$t('692ba07e.92448a')}</View>
                  <View className='at-input__input'>{info.mobile}</View>
                  <View className='at-input__children'>
                    <AtButton
                      openType='getPhoneNumber'
                      onGetPhoneNumber={this.handleGetPhoneNumber}
                    >
                      {$t('5e103177.e24bc7')}
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
                  title={$t('692ba07e.92448a')}
                  name='mobile'
                  type='number'
                  maxLength={11}
                  value={info.mobile}
                  placeholder={$t('3c94bb91.ff95a4')}
                  onFocus={this.handleErrorToastClose}
                  onChange={this.handleChange.bind(this, 'mobile')}
                />
                {imgVisible ? (
                  <AtInput
                    title={$t('5e103177.fcbe6f')}
                    name='yzm'
                    value={info.yzm}
                    placeholder={$t('5e103177.42ae8e')}
                    onFocus={this.handleErrorToastClose}
                    onChange={this.handleChange.bind(this, 'yzm')}
                  >
                    <Image src={`${imgInfo.imageData}`} onClick={this.handleClickImgcode} />
                  </AtInput>
                ) : null}
                <AtInput
                  title={$t('1c525225.983f59')}
                  name='vcode'
                  value={info.vcode}
                  placeholder={$t('4e9d53b5.d0c06a')}
                  onFocus={this.handleErrorToastClose}
                  onChange={this.handleChange.bind(this, 'vcode')}
                >
                  <SpTimer onStart={this.handleTimerStart} onStop={this.handleTimerStop} />
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
            {isHasData &&
              list.map((item, index) => {
                return (
                  <View key={`${index}1`}>
                    {item.element_type === 'input' ? (
                      <View key={`${index}1`}>
                        <AtInput
                          key={`${index}1`}
                          title={item.name}
                          name={`${item.key}`}
                          placeholder={ti('b1a8838b.72ba91', [item.name])}
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
                                <View className='picker__title'>{item.name}</View>
                                <Text
                                  className={classNames(
                                    item.value ? 'pick-value' : 'pick-value-null'
                                  )}
                                >
                                  {item.value ? item.value : ti('cb825098.a5db4e', [item.name])}
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
                                <View className='picker__title'>{item.name}</View>
                                <Text
                                  className={classNames(
                                    item.value ? 'pick-value' : 'pick-value-null'
                                  )}
                                >
                                  {item.value ? item.value : ti('cb825098.a5db4e', [item.name])}
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
                          key={`${index}1`}
                          title={item.name}
                          name={`${item.key}`}
                          placeholder={ti('cb825098.a5db4e', [item.name])}
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
              <FormIdCollector sync>
                <AtButton className='submit-btn' type='primary' formType='submit'>
                  {$t('4e9d53b5.3179ba')}
                </AtButton>
                <AtButton type='default' onClick={this.handleBackHome.bind(this)}>
                  {$t('5e103177.f01026')}
                </AtButton>
              </FormIdCollector>
            ) : (
              <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>
                {$t('4e9d53b5.3179ba')}
              </AtButton>
            )}
            <View className='accountAgreement'>
              {$t('4e9d53b5.b840cb')}
              <Text
                className='accountAgreement__text'
                onClick={this.handleClickAgreement.bind(this)}
              >
                {$t('5e103177.b4a788')}
              </Text>
            </View>
          </View>
        </AtForm>
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
                {$t('61e2d21a.625fb2')}
              </View>
              <View className='panel-btn require-btn' onClick={this.btnClick.bind(this, 'require')}>
                {$t('b232790d.38cf16')}
              </View>
            </View>
          </View>
        ) : null}
        <SpToast />
      </View>
    )
  }
}

export default connect(
  ({ user }) => ({
    land_params: user.land_params
  }),
  () => ({})
)(withTranslation()(Reg))
