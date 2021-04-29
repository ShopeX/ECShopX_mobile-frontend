/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/marketing/pages/member/userinfo.js
 * @Date: 2021-04-28 14:13:43
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-04-29 16:14:32
 */
import Taro, { Component } from '@tarojs/taro'
import { Input, View, Picker, Button } from '@tarojs/components'
import { NavBar } from '@/components'
import api from '@/api'
// import { withLogin } from '@/hocs'
import S from '@/spx'
import { connect } from "@tarojs/redux"

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
        baseInfo: [
          {
            name: '我的头像',
            key: 'avatar',
            isRequired: true,
            type: 'image'
          }
        ],
        basicInfo: [
          {
            name: '我的头像',
            key: 'avatar',
            isRequired: true,
            type: 'text'
          }
        ]
      },
      canIUseGetUserProfile: false,
      // 是否获取过微信信息
      isGetWxInfo: false
    }
  }

  componentDidMount () {
    // this.fetch()
    if (wx.getUserProfile) {
      this.setState({
        canIUseGetUserProfile: true
      })
    }
  }

  config = {
    navigationBarTitleText: '个人信息'
  }

  // getUserProfile 新事件
  handleGetUserProfile = () => {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: data => {
        const res = {
          detail: data
        }
        this.handleGetUserInfo(res)
      }
    })
  }


  handleGetUserInfo = async (res) => {
    console.log(res)
    this.setState({
      isGetWxInfo: true
    })
  }

  // 获取用户信息
  getUserInfo = async () => {
    
  }

  // 获取表单字段
  getFormItem = async () => {
    
  }

  // 退出登录
  loginOut = () => {
    S.logout()
  }

  // 保存用户信息
  saveInfo = (e) => {
    e && e.stopPropagation()
    Taro.navigateBack()
    console.log('saveInfo')
  }

  render () {
    const { canIUseGetUserProfile, isGetWxInfo, formItems } = this.state
    const { colors } = this.props
    return (
      <View className='page-member-setting'>
        <NavBar
          title='用户信息'
        />
        <View className='baseInfo'>
          {
            formItems.baseInfo.map(item => <View className='item' key={item.key}>
              <View className='left'>{ item.name }</View>
              {
                !isGetWxInfo ? <View className='right'>
                  {
                    canIUseGetUserProfile ? <Button
                      className='getInfoBtn'
                      hoverClass='none'
                      onClick={this.handleGetUserProfile.bind(this)}
                    >
                      授权允许
                    </Button>
                    : <Button
                      className='getInfoBtn'
                      openType='getUserInfo'
                      hoverClass='none'
                      onGetUserInfo={this.handleGetUserInfo.bind(this)}
                    >
                      授权允许
                    </Button>
                  }
                </View> : <View className='right'>
                  isGetWxInfo
                </View>
              }
            </View>)
          }
        </View>
        <View className='basicInfo'>
          <View className='title'>基础信息</View>
          {
            [0, 1, 2, 3, 4].map(item => <View key={item} className='item'>
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
