import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtInput, AtButton, AtIcon } from 'taro-ui'
import { SpToast, SpTimer, SpNavBar } from '@/components'
import { RGCheckbox } from './comps'
import { classNames, styleNames, isString, tokenParse, getQueryVariable } from '@/utils'
import S from '@/spx'
import api from '@/api'
import './reg.scss'

const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

@connect(
  ({ user }) => ({
    land_params: user.land_params
  }),
  () => ({})
)
export default class Reg extends Component {
  config = {
    navigationBarTitleText: '导购商城'
  }
  constructor(props) {
    super(props)

    this.state = {
      info: {},
      isVisible: false,
      list: [],
      imgVisible: false,
      imgInfo: {},
      isHasValue: false,
      isChecked: false,
      isSubmit: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
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
    Object.keys(res).forEach((key) => {
      if (res[key].is_open) {
        if (key === 'sex') {
          res[key].items = ['男', '女']
        }
        if (key === 'birthday') {
          res[key].items = []
        }
        arr.push({
          key: key,
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
    })
    this.count = 0
  }

  handleSubmit = async (e) => {
    const redirect = this.$router.params.redirect
    let redirect_url = decodeURIComponent(redirect)
    const { isChecked, isSubmit } = this.state
    const data = {
      ...this.state.info
    }

    console.log(data)

    if (!isSubmit) return false
    if (!isChecked) {
      return S.toast('请勾选并阅读已同意《服务条款》及《隐私政策》')
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
    this.state.list.map((item) => {
      return item.is_required
        ? item.is_required && data[item.key]
          ? true
          : S.toast(`请输入${item.name}`)
        : null
    })

    try {
      if (isWeapp) {
        const { union_id, open_id } = this.$router.params
        const track = Taro.getStorageSync('trackParams')
        let source_id = 0,
          monitor_id = 0
        if (track) {
          source_id = track.source_id
          monitor_id = track.monitor_id
        }
        let regParams = {
          ...data,
          user_type: 'wechat',
          auth_type: 'wxapp',
          union_id,
          open_id,
          source_id,
          monitor_id
        }

        const res = await api.user.reg(regParams)

        const { code } = await Taro.login()
        let loginParams = {
          code
        }
        return
      } else {
        const res = await api.user.reg(data)
        S.setAuthToken(res.token)
      }

      S.toast('注册成功')
      setTimeout(() => {
        if (redirect_url) {
          Taro.redirectTo({
            url: redirect_url
          })
        } else {
          Taro.redirectTo({
            url: `/guide/index`
          })
        }
      }, 700)
    } catch (error) {
      return false
    }
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url && base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var arr_base64 = Taro.base64ToArrayBuffer(base64)
    arr_base64 = String.fromCharCode.apply(null, new Uint8Array(arr_base64))
    var jsonPayload = decodeURIComponent(
      arr_base64
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(jsonPayload)
  }

  handleChange = (name, val) => {
    // console.log(name, val, 126)
    const { info, list } = this.state
    if (isString(val)) {
      val = val.replace(/\s/g, '')
    }

    info[name] = val
    if (name === 'mobile') {
      if (val.length === 11 && this.count === 0) {
        this.count = 1
        this.setState({
          imgVisible: true
        })
      }
    }
    if (!isString(val)) {
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
    } else {
      list.map((item) => {
        item.key === name ? (item.value = val) : null
      })
    }
    this.setState({ list })
    if (name === 'sex') {
      if (val.detail.value == 0) {
        info[name] = 1
      } else {
        info[name] = 2
      }
    }
    let flag = true
    list.forEach((item) => {
      if (item.is_required && !info[item.key]) {
        flag = false
      }
    })
    if (!info.mobile) {
      flag = false
    }
    this.setState({
      isSubmit: flag
    })
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

  handleClickAgreement = (type) => {
    Taro.navigateTo({
      url: '/pagesA/pages/auth/reg-rule?type=' + type
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
  setIsChecked = (isChecked) => {
    this.setState({
      isChecked
    })
  }

  render() {
    const {
      info,
      isVisible,
      isHasValue,
      list,
      imgVisible,
      imgInfo,
      isChecked,
      isSubmit
    } = this.state

    return (
      <View className='auth-reg'>
        <SpNavBar title='注册' leftIconType='chevron-left' />
        <View
          className='regbg'
          style={styleNames({
            'background-image':
              'url(https://bbc-espier-images.amorepacific.com.cn/image/2/2020/10/29/7cb0c703e9d188da579c5e392c5bd9a6DyU1P54yuldsGpe0TccOhWNGPU0j5ljV)'
          })}
        ></View>

        <AtForm onSubmit={this.handleSubmit}>
          <View className='auth-reg__form'>
            {process.env.TARO_ENV === 'weapp' && (
              <View className=''>
                <View className='auth-reg__phone'>
                  <AtIcon
                    className='auth-reg__selectedicon'
                    prefixClass='in-icon'
                    value='mobile'
                    size='15'
                    color='#cccccc'
                  ></AtIcon>

                  {!info.mobile && <View className='auth-reg__title'>请获取手机号码</View>}
                  <View className='at-input__input'>{info.mobile}</View>
                  <View className='auth-reg__getPhone'>
                    <AtButton
                      className='auth-reg__getPhoneBtn'
                      openType='getPhoneNumber'
                      onGetPhoneNumber={this.handleGetPhoneNumber}
                    >
                      获取微信手机号码
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
                    name='yzm'
                    value={info.yzm}
                    placeholder='请输入图片验证码'
                    onFocus={this.handleErrorToastClose}
                    onChange={this.handleChange.bind(this, 'yzm')}
                  >
                    <Image src={`${imgInfo.imageData}`} onClick={this.handleClickImgcode} />
                  </AtInput>
                ) : null}
                <AtInput
                  title='验证码'
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

            {list.map((item, index) => {
              return (
                <View key='key'>
                  {item.items ? (
                    <View className='page-section'>
                      <View>
                        {item.key === 'birthday' ? (
                          <Picker
                            mode='date'
                            onChange={this.handleChange.bind(this, `${item.key}`)}
                          >
                            <View className='picker'>
                              <AtIcon
                                className='auth-reg__selectedicon'
                                prefixClass='in-icon'
                                value={item.key}
                                size='18'
                                color='#cccccc'
                              ></AtIcon>

                              <Text
                                className={classNames(
                                  item.value ? 'pick-value' : 'pick-value-null'
                                )}
                              >
                                {item.value
                                  ? item.value
                                  : `请选择${item.name}${
                                      item.is_required ? '*   (必填)' : '  (选填)'
                                    }`}
                              </Text>
                            </View>
                          </Picker>
                        ) : (
                          <Picker
                            mode='selector'
                            range={item.items}
                            data-item={item}
                            onChange={this.handleChange.bind(this, `${item.key}`)}
                          >
                            <View className='picker'>
                              <AtIcon
                                className='auth-reg__selectedicon'
                                prefixClass='in-icon'
                                value={item.key}
                                size='18'
                                color='#cccccc'
                              ></AtIcon>

                              <Text
                                className={classNames(
                                  item.value ? 'pick-value' : 'pick-value-null'
                                )}
                              >
                                {item.value
                                  ? item.value
                                  : `请选择${item.name}${
                                      item.is_required ? '*  (必填))' : '   (选填)'
                                    }`}
                              </Text>
                            </View>
                          </Picker>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View className='auth-reg__input'>
                      <AtIcon
                        className='auth-reg__icon'
                        prefixClass='in-icon'
                        value={item.key}
                        size='18'
                        color='#cccccc'
                      ></AtIcon>
                      <AtInput
                        className='auth-reg__input-name'
                        border={false}
                        placeholderStyle='color:#a6a6a6;'
                        name={`${item.key}`}
                        placeholder={`请输入${item.name === 'email' ? '邮箱' : item.name}${
                          item.is_required ? '*   (必填)' : '  (选填)'
                        }`}
                        value={item.value}
                        onFocus={this.handleErrorToastClose}
                        onChange={this.handleChange.bind(this, `${item.key}`)}
                        ref={(input) => {
                          this.textInput = input
                        }}
                      />
                    </View>
                  )}
                </View>
              )
            })}
          </View>
          <View className='accountAgreement'>
            <RGCheckbox onChange={this.setIsChecked} checked={isChecked}></RGCheckbox>
            <View className='accountAgreement__text'>
              我已阅读并同意
              <Text className='agreen' onClick={this.handleClickAgreement.bind(this, 'service')}>
                《服务条款》
              </Text>
              及
              <Text className='agreen' onClick={this.handleClickAgreement.bind(this, 'privacy')}>
                《隐私政策》
              </Text>
            </View>
          </View>
          <View className='btns'>
            {process.env.TARO_ENV === 'weapp' ? (
              <AtButton
                type='primary'
                formType='submit'
                className={`${isSubmit ? '' : 'unactive'}`}
              >
                提交
              </AtButton>
            ) : (
              <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>
                提交
              </AtButton>
            )}
          </View>
        </AtForm>

        <SpToast />
      </View>
    )
  }
}
