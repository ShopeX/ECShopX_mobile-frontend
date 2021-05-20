/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 获取用户信息按钮封装
 * @FilePath: /unite-vshop/src/marketing/pages/member/comps/getUserInfo.js
 * @Date: 2021-05-06 15:34:03
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-05-07 14:44:26
 */
import Taro, { Component } from '@tarojs/taro'
import { Button, View } from '@tarojs/components'

export default class GetUserInfoBtn extends Component {

  constructor(props) {
    super(props)
    this.setState({
      canIUseGetUserProfile: false
    })
  }

  componentDidMount () {
    if (wx.getUserProfile) {
      this.setState({
        canIUseGetUserProfile: true
      })
    }
  }

  static options = {
    addGlobalClass: true
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
      },
      fail: () => {
        this.handleGetUserInfo({})
      }
    })
  }


  handleGetUserInfo = async (res) => {
    const { onGetUserInfo } = this.props
    onGetUserInfo && onGetUserInfo(res)
  }

  render () {
    const { isGetUserInfo = false } = this.props
    const { canIUseGetUserProfile } = this.state

    return <View className='btnContent'>
      {
        isGetUserInfo ? this.props.children 
        : <View className='content'>
          {
            canIUseGetUserProfile ? <Button
              className='getInfoBtn'
              hoverClass='none'
              onClick={this.handleGetUserProfile.bind(this)}
            >
              { this.props.children }
            </Button>
            : <Button
              className='getInfoBtn'
              openType='getUserInfo'
              hoverClass='none'
              onGetUserInfo={this.handleGetUserInfo.bind(this)}
            >
              { this.props.children }
            </Button>
          }
        </View>
      }
    </View>
  }
}
