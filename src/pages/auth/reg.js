import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpToast, Timer } from '@/components'
import { classNames, isString } from '@/utils'
import S from '@/spx'
import api from '@/api'

import './reg.scss'

export default class Reg extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      timerMsg: '获取验证码',
      isVisible: false,
      list: [],
      imgVisible: false,
      imgUrl: ''
      // dateSel: '2018-04-22'
    }
  }

  componentDidMount () {
    console.log(Taro.getEnv())
    if (Taro.getEnv() === 'WEAPP') {
      this.setState({
        info: {
          user_type: 'wechat'
        }
      })
    }else if (Taro.getEnv() === 'WEB') {
      this.setState({
        info: {
          user_type: 'local'
        }
      })
    }
    this.fetch()
  }

  // onDateChange = e => {
  //   this.setState({
  //     dateSel: e.detail.value
  //   })
  // }
  async fetch () {
    let arr  = []
    let res = await api.user.regParam()
    Object.keys(res).forEach(key => {
      if(res[key].is_open) {
        if(key === 'sex'){
          res[key].items = ['男', '女']
        }
        if(key === 'birthday'){
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
    const query = {
      type: 'sign'
    }
    let resImg = await api.user.regImg(query)
    console.log(resImg)
    // imgUrl
    this.setState({
      list: arr,
    });
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

    // if (!data.code) {
    //   return S.toast('请选择验证码')
    // }

    if (!data.password) {
      return S.toast('请输入密码')
    }
    this.state.list.map(item=>{
      return item.is_required ? (item.is_required && data[item.key] ? true : S.toast(`请输入${item.name}`)) : null
    })
    console.log(data)

    const { UserInfo } = await api.user.reg(data)
    console.log(UserInfo)
  }

  handleChange = (name, val) => {
    const { info, list } = this.state
    info[name] = val
    if(name === 'mobile') {
      if(val.length === 11) {
        this.setState({
          imgVisible: true
        })
      }
    }
    if(!isString(val)) {
      list.map(item => {
        item.key === name ? info[name] = val.detail.value : null
        if(name === 'birthday') {
          item.key === name ? item.value = val.detail.value : null
        } else {
          item.key === name ? (item.items ? item.value = item.items[val.detail.value] : item.value = val.detail.value) : null
        }
      })
    } else {
      list.map(item => {
        item.key === name ? item.value = val : null
      })
    }
    this.setState({ list });
    if(name === 'sex') {
      if(info[name] === '男') {
        info[name] = 1
      } else {
        info[name] = 2
      }
    }
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

  handleTimerStart = (resolve) => {
    if (this.state.isTimerStart) return
    const { mobile } = this.state.info

    if (!/1\d{10}/.test(mobile)) {
      return S.toast('请输入正确的手机号')
    }
    console.log(222)

    return false
    resolve()
  }

  handleUpdateTimer = (val) => {
    const timerMsg = `${val}s`
    this.setState({
      timerMsg
    })
  }

  handleTimerStop = () => {
    this.setState({
      timerMsg: '重新获取'
    })

  }

  handleClickAgreement = () => {
    // Taro.navigateTo({
    //   url: '/pages/auth/login'
    // })
    console.log("用户协议")
  }

  render () {
    const { info, timerMsg, isVisible, list, imgVisible } = this.state

    return (
      <View className='auth-reg'>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec auth-reg__form'>
            <AtInput
              title='手机号码'
              name='mobile'
              maxLength={11}
              value={info.mobile}
              placeholder='请输入手机号码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'mobile')}
            />
            {
              imgVisible
                ? <AtInput title='图片验证码' name='yzm' value={info.yzm} placeholder='请输入图片验证码' onFocus={this.handleErrorToastClose} onChange={this.handleChange.bind(this, 'yzm')}>
                    <Image />
                  </AtInput>
                : null
            }
            <AtInput
              title='验证码'
              name='code'
              value={info.code}
              placeholder='请输入验证码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'code')}
            >
              <Timer
                onStart={this.handleTimerStart}
                onUpdateTimer={this.handleUpdateTimer}
                onStop={this.handleTimerStop}
                timerMsg={timerMsg}
              />
            </AtInput>
            <AtInput
              title='密码'
              name='password'
              type={isVisible ? 'text' : 'password'}
              value={info.password}
              placeholder='请输入密码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'password')}
            >
              {
                isVisible
                  ? <View className='sp-icon sp-icon-yanjing icon-pwd' onClick={this.handleClickIconpwd}> </View>
                  : <View className='sp-icon sp-icon-icon6 icon-pwd' onClick={this.handleClickIconpwd}> </View>
              }
            </AtInput>
            {
              list.map((item, index) => {
                return (
                  <View key={index}>
                    {
                      item.items
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
                        : <View key={index}>
                            <AtInput
                              key={index}
                              title={item.name} name={`${item.key}`}
                              placeholder={`请输入${item.name}`}
                              value={item.value}
                              onFocus={this.handleErrorToastClose}
                              onChange={this.handleChange.bind(this, `${item.key}`)}
                            />
                          </View>
                    }
                  </View>
                )
              })

            }
          </View>
          <View className='btns'>
            {
              Taro.getEnv() === 'WEAPP'
                ? <AtButton type='primary' formType='submit'>同意协议并注册</AtButton>
                : null
            }
            {
              Taro.getEnv() === 'WEB'
                ? <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>同意协议并注册</AtButton>
                : null
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

        <SpToast />
      </View>
    )
  }
}
