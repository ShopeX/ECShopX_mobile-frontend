import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

import './exclusive-customer-service.scss'

export default class ExclusiveCustomerService extends Component {
  static defaultProps = {
    isOpened: false
  }

  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {}

  static options = {
    addGlobalClass: true
  }

  config = {
    // 定义需要引入的第三方组件
    usingComponents: {
      'cell': 'plugin://contactPlugin/cell'
    }
  }

  /**
   * 监听按钮点击事件执行开始时的回调
   * */
  startmessage () {
    console.log('监听按钮点击事件执行开始时的回调')
  }

  /**
   * 监听按钮点击事件执行完毕后的回调
   * */
  completemessage () {
    console.log('监听按钮点击事件执行完毕后的回调')
  }

  render () {
    let { info } = this.props

    if (!info) return null

    return (
      <View className='exclusive-customer-service exclusive'>
        <View className='exclusive-title'>我的导购/专属客服</View>

        <View className='exclusive-con'>
          <View className='exclusive-con__avatar'>
            <AtAvatar image={info.avatar} size='small' circle />
          </View>
          <View className='exclusive-con__info'>
            <View>
              <Text className='exclusive-con__info-name'>{info.name}</Text>
              <Text className='exclusive-con__info-store_name'>{info.distributor.store_name}</Text>
            </View>
            <View className='exclusive-con__info-store_address'>
              {info.distributor.store_address}
            </View>
          </View>
        </View>

        <View className='exclusive-button flex'>
          <View className='d-button border-r contact-ta'>
            <View className='contact-ta__text'>联系TA</View>
            <cell
              startmessage={this.startmessage.bind(this)}
              completemessage={this.completemessage.bind(this)}
              plugid={info.work_configid}
            />
          </View>
          {/* <Button className='d-button border-r'>联系TA</Button> */}
          <Button
            className='d-button'
            onClick={() => {
              Taro.navigateTo({ url: '/pages/member/complaint' })
            }}
          >
            投诉TA
          </Button>
        </View>
      </View>
    )
  }
}
