/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 修改绑定手机号
 * @FilePath: /unite-vshop/src/subpage/pages/auth/bindPhone.js
 * @Date: 2021-05-06 10:59:01
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-05-06 14:42:12
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Input, Button } from '@tarojs/components'
import { connect } from "@tarojs/redux"
import api from '@/api'
import { Timer } from '@/components'


import './bindPhone.scss'

@connect(( { colors } ) => ({
  colors: colors.current || { data: [{}] } 
}), () => ({}))
export default class BindPhone extends Component {

  constructor(props) {
    super(props)

    this.state = {
      currentMobile: '',
      mobile: '',
      smsCode: '',
      countDown: 0
    }
  }

  config = {
    navigationBarTitleText: '修改手机号'
  }

  // 获取手机号
  getPhoneNumber = async (res) => {
    // const { encryptedData, iv } = res.detail
    console.log(res)
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
      type: 'sign',
      mobile: mobile,
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
  handleEdit = () => {
    const { mobile, smsCode } = this.state

    if (!mobile || !smsCode) {
      const msg = !mobile ? '请输入手机号' : '请输入验证码'
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      return false
    } 
    console.log(mobile)
    console.log(smsCode)
    Taro.showToast({
      title: '修改成功',
      mask: true,
      duration: 2000
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 2000)
  }
  
  render () {
    const { currentMobile, mobile, smsCode } = this.state
    const { colors } = this.props

    return <View className='bindPhone'>
      <View className='logo'>
        <Image
          className='img'
          src='https://store-images.s-microsoft.com/image/apps.1081.13510798886607585.e5e9691e-c9bf-4ee0-ae21-cc7601c0cee5.03207cec-5f89-409c-aec9-3253099cfced?mode=scale&q=90&h=270&w=270&background=%230078D7'
          mode='aspectFill'
        />
        <View className='currentPhone'>
          当前手机号：+86 { currentMobile }
        </View>
      </View>
      <View className='form'>
        <View className='item'>中国大陆 +86</View>
        <View className='item'>
          <Input type='number' value={mobile} placeholder='请输入您的手机号' onInput={this.onInput.bind(this, 'phone')} />
          <Button
            className='btn'
            openType='getPhoneNumber'
            onGetPhoneNumber={this.getPhoneNumber.bind(this)}
            style={`color: ${colors.data[0].primary}`}
          >
            授权号码
          </Button>
        </View>
        <View className='item'>
          <Input placeholder='请输入验证码' value={smsCode} onInput={this.onInput.bind(this, 'sms')} />
          <Timer
            style={`color: ${colors.data[0].primary} !important`}
            className='time'
            onStart={this.getSmsCode.bind(this)}
          >
          </Timer>
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
    </View>
  }
}