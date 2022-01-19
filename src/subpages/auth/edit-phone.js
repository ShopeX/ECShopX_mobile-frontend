import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Input, Button } from '@tarojs/components'
import { isWeb, isWeixin } from '@/utils'
import { connect } from 'react-redux'
import api from '@/api'
import { SpTimer, SpPage } from '@/components'
import S from '@/spx'
import './edit-phone.scss'

@connect(
  ({ colors }) => ({
    colors: colors.current || { data: [{}] }
  }),
  () => ({})
)
export default class BindPhone extends Component {
  constructor (props) {
    super(props)

    this.state = {
      countryCode: '+86',
      oldCountryCode: '+86',
      currentMobile: '',
      mobile: '',
      smsCode: '',
      baseInfo: {}
    }
  }

  componentDidMount () {
    this.getStoreSettingInfo()
    this.getUserInfo()
  }

  // 获取总店配置信息
  async getStoreSettingInfo () {
    const data = await api.shop.getStoreBaseInfo()
    this.setState({
      baseInfo: data
    })
  }

  // 获取手机号
  getPhoneNumber = async (res) => {
    const { encryptedData, iv } = res.detail
    if (encryptedData && iv) {
      const { code } = await Taro.login()
      const { phoneNumber, countryCode } = await api.wx.decryptPhone({
        encryptedData,
        iv,
        code
      })
      this.setState({
        mobile: phoneNumber,
        countryCode,
        oldCountryCode: countryCode
      })
    }
  }

  // 获取验证码
  getSmsCode = async (resolve) => {
    const { mobile } = this.state
    if (!/1\d{10}/.test(mobile)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }
    const query = {
      type: 'update',
      mobile
    }
    try {
      await api.user.regSmsCode(query)
      Taro.showToast({
        title: '发送成功',
        icon: 'none'
      })
    } catch (error) {
      return false
    }
    resolve()
  }

  // 获取用户信息
  getUserInfo = async () => {
    const { memberInfo } = await api.member.memberInfo()
    this.setState({
      currentMobile: memberInfo.mobile,
      mobile: memberInfo.mobile
    })
  }

  // 输入
  onInput = (type, e) => {
    const { detail } = e
    if (type === 'phone') {
      this.setState({
        mobile: detail.value
      })
    } else {
      this.setState({
        smsCode: detail.value
      })
    }
  }

  // 确认修改
  handleEdit = async () => {
    const { mobile, smsCode, countryCode, currentMobile, oldCountryCode } = this.state
    if (!mobile || !smsCode) {
      const msg = !mobile ? '请输入手机号' : '请输入验证码'
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      return false
    }
    await api.member.setMemberMobile({
      old_mobile: currentMobile,
      old_region_mobile: oldCountryCode + currentMobile,
      old_country_code: oldCountryCode,
      new_mobile: mobile,
      new_region_mobile: countryCode + mobile,
      new_country_code: countryCode,
      smsCode
    })
    Taro.showToast({
      title: '修改成功',
      mask: true,
      duration: 2000
    })
    await S.getMemberInfo()
    setTimeout(() => {
      Taro.navigateBack()
    }, 2000)
  }

  render () {
    const { currentMobile, mobile, smsCode, countryCode, baseInfo } = this.state
    const { colors } = this.props

    console.log('===mobile==', mobile)

    return (
      <SpPage className='page-edit-phone'>
        <View className='logo'>
          <Image className='img' src={baseInfo.logo} mode='aspectFill' />
          <View className='currentPhone'>
            当前手机号：{countryCode} {currentMobile}
          </View>
        </View>
        <View className='form'>
          <View className='item'>
            <Input
              type='number'
              value={mobile}
              placeholder='请输入您的手机号'
              onInput={this.onInput.bind(this, 'phone')}
            />
            {isWeixin && (
              <Button
                className='btn'
                openType='getPhoneNumber'
                onGetPhoneNumber={this.getPhoneNumber.bind(this)}
              >
                授权号码
              </Button>
            )}
          </View>
          <View className='item'>
            <Input
              placeholder='请输入验证码'
              value={smsCode}
              onInput={this.onInput.bind(this, 'sms')}
            />
            <SpTimer className='time' onStart={this.getSmsCode.bind(this)}></SpTimer>
          </View>
          <View className='tip'>
            <View className='line'>* 手机号每30天可修改一次；</View>
            <View className='line'>* 目前仅支持中国大陆手机号；</View>
          </View>
          <View
            className='submit'
            style={`background: ${colors.data[0].primary}`}
            onClick={this.handleEdit.bind(this)}
          >
            修改手机号
          </View>
        </View>
      </SpPage>
    )
  }
}
