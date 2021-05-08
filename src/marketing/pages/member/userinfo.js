/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/marketing/pages/member/userinfo.js
 * @Date: 2021-04-28 14:13:43
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-05-08 18:40:06
 */
import Taro, { Component } from '@tarojs/taro'
import { Input, View, Picker, Image } from '@tarojs/components'
import { NavBar } from '@/components'
import api from '@/api'
import { connect } from "@tarojs/redux"
import S from '@/spx'
import imgUploader from '@/utils/upload'
import GetUserInfoBtn from './comps/getUserInfo'
// import { withLogin } from '@/hocs'

import './userinfo.scss'

@connect(( { colors } ) => ({
  colors: colors.current
}), () => ({}))
// @withLogin()

export default class UserInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userInfo: {},
      formItems: {
        baseInfo: [],
        basicInfo: [
          {
            name: '我的头像',
            key: 'avatar',
            isRequired: true,
            type: 'text'
          }
        ]
      },
      // 是否获取过微信信息
      isGetWxInfo: false
    }
  }

  componentDidMount () {
    this.getUserInfo()
    this.getFormItem()
  }

  config = {
    navigationBarTitleText: '个人信息'
  }


  // 获取用户信息
  getUserInfo = async () => {
    const { memberInfo } = await api.member.memberInfo()
    this.setState({
      userInfo: memberInfo
    })
  }

  // 获取微信用户信息
  getWxUserInfo = (res) => {
    if (res.detail) {
      const { userInfo } = res.detail
      console.log(userInfo)
    }
    this.setState({
      isGetWxInfo: true
    })
  }

  // 上传头像
  handleAvatar = async () => {
    const { isGetWxInfo, userInfo } = this.state
    if (isGetWxInfo) {
      try {
        const { tempFiles = [] } = await Taro.chooseImage({
          count: 1
        })
        if (tempFiles.length > 0) {
          const imgFiles = tempFiles.slice(0, 1).map(item => {
            return {
              file: item,
              url: item.path
            }
          })
          const res = await imgUploader.uploadImageFn(imgFiles)
          userInfo.avatar = res[0].url
          this.setState({
            userInfo
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  // 获取表单字段
  getFormItem = async () => {
    const { validate_fields } = await api.user.regParam()
    const { formItems } = this.state
    // 默认展示字段key
    const normalKey = ['mobile', 'username', 'sex']
    const normalFiled = []
    for (let i = 0; i < normalKey.length; i++) {
      const keyName = normalKey[i]
      const data =  validate_fields.find(item => item.key_name === keyName)
      if (data) {
        normalFiled.push(data)
      }
    }
    formItems.baseInfo = normalFiled
    this.setState({
      formItems
    })
  }

  // 退出登录
  loginOut = () => {
    S.logout()
  }

  // 更换手机号
  editPhone = (e) =>{
    e && e.stopPropagation()
    Taro.navigateTo({
      url: '/subpage/pages/auth/bindPhone'
    })
  }

  // 保存用户信息
  saveInfo = async (e) => {
    e && e.stopPropagation()
    const data = {}
    await api.member.setMemberInfo(data)
    Taro.showToast({
      title: '修改成功',
      mask: true,
      duration: 1500
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  render () {
    const { formItems, userInfo, isGetWxInfo } = this.state
    const { colors } = this.props
    return (
      <View className='page-member-setting'>
        <NavBar
          title='用户信息'
        />
        <View className='baseInfo'>
          <GetUserInfoBtn isGetUserInfo={isGetWxInfo} onGetUserInfo={this.getWxUserInfo.bind(this)}>
            <View className='item'>
              <View className='left'>我的头像</View>
              <View className='right'>
                <Image src={userInfo.avatar} mode='aspectFill' className='avatar' onClick={this.handleAvatar.bind(this)} />
              </View>
            </View>
            {
              formItems.baseInfo.map(item => item.key_name === 'mobile'
              ? <View 
                className='item'
                key={item.key_name}
                onClick={this.editPhone.bind(this)}
              >
                <View className='left'>{ item.label }</View>
                <View className='right'>
                  isGetWxInfo
                </View>
              </View>
              :<View 
                className='item'
                key={item.key_name}
              >
                <View className='left'>{ item.label }</View>
                <View className='right'>
                  isGetWxInfo
                </View>
              </View>)
            }
          </GetUserInfoBtn>
        </View>
        <View className='basicInfo'>
          <View className='title'>基础信息</View>
          {
            [0, 1, 2, 3].map(item => <View key={item} className='item'>
              <View className='left'>我的昵称</View>
              <View className='right'>
                { item === 0 && <Input className='input' /> }
                { 
                  item === 1 && <Picker mode='date'>
                    <View className='picker'>
                      1111
                    </View>
                  </Picker> 
                }
                { 
                  item === 2 && <Picker
                    mode='selector'
                    range={[0, 2, 3, 5, 6, 7]}
                  >
                    <View className='picker'>
                      1111
                    </View>
                  </Picker>
                }
                { item === 3 && <Input className='input' type='number' max='10' min='5' /> }
              </View>
            </View>)
          }
        </View>
        <View className='btns'>
          <View className='btn loginOut' onClick={this.loginOut.bind(this)}>退出登录</View>
          <View
            className='btn save'
            style={`background: ${colors.data[0].primary}`}
            onClick={this.saveInfo.bind(this)}
          >
            保存
          </View>
        </View>
      </View>
    )
  }
}
