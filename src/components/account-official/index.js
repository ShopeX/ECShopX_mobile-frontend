import Taro, { Component } from '@tarojs/taro'
import { View, OfficialAccount, Image } from '@tarojs/components'
import {connect} from "@tarojs/redux";
import { classNames } from '@/utils'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class AccountOfficial extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    isLink: false,
    value: null,
    border: true,
    title: '',
    arrow: 'right',
    onClick: () => {},
    onHandleError: () => {}
  }

  componentDidShow() {
    this.handleClickError()
    this.handleClickLoad()
  }

  handleClickClose =() => {
    this.props.onClick()
  }

  handleClickLoad = (res) => {
    if(res && res.detail) {
      let status_cur = res.detail.status
      this.props.onHandleError(status_cur)
    }
  }

  handleClickError = (error) => {
    if(error && error.detail) {
      let status_cur = error.detail.status
      this.props.onHandleError(status_cur)
    }
  }

  render () {
    const { colors } = this.props
    return (
      <View className='account-view'>
       {/* <View className='account-view__show' style={`background: ${colors.data[0].primary}`}>
          <View className='account-view__title'>Marionnaud  Paris 玛莉娜商城关联的公众号</View>
          <View className='account-view__content'>
            <View className='account-view__left'>
              <Image src='/assets/imgs/logo.png' mode='aspectFit' className='account-view__img'></Image>
              <View className='account-view__left_text'>
                <View className='title_text'>Marionnaud  Paris 玛莉娜</View>
                <View className='tip_text'>Beauty is mine</View>
              </View>
            </View>
            <View className='account-view__btn'>关注</View>
          </View>
        </View> */}
        <OfficialAccount
          className='account-view__official'
          onLoad={(res) => this.handleClickLoad(res)}
          onError={(error) => this.handleClickError(error)}
        />
        <View className='zoom-btn icon-close' onClick={this.handleClickClose.bind(this)}></View>
      </View>
    )
  }
}
