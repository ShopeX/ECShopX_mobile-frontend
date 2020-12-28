/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 绑定大屏订单
 * @FilePath: /unite-vshop/src/others/pages/bindOrder/index.js
 * @Date: 2020-12-28 09:46:33
 * @LastEditors: Arvin
 * @LastEditTime: 2020-12-28 14:17:42
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import { connect } from '@tarojs/redux'
import api from '@/api'
import { NavBar } from '@/components'


import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class BindOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      barCode: '',
      randomCode: '',
      showModal: false,
      tips: '',
      tipImg: ''
    }
  }

  showTips = (tipType) => {
    const tips = tipType ? '找到门店购物小票如下图红框位置，可手动输入或者扫码输入订单号' : '找到门店购物小票如下图红框位置内容输入'
    const img = tipType ? require('./img/barCode.png') : require('./img/randomCode.png')
    this.setState({
      tips,
      tipImg: img,
      showModal: true
    })
  }

  hideModal = () => {
    this.setState({
      showModal: false
    })
  }

  scanCode = async (e) => {
    e.stopPropagation()
    const { result = ''} = await Taro.scanCode()
    this.setState({
      barCode: result
    })
  }

  inputChange = (type, e) => {
    const { value } = e.detail
    this.setState({
      [type]: value
    })
  }

  bindOrder = async () => {
    const { barCode, randomCode } = this.state
    if (!barCode || !randomCode) {
      Taro.showToast({
        title: '请输入订单号和随机码',
        icon: 'none'
      })
      return false
    }
    const params = {
      order_id: barCode,
      auth_code: randomCode
    }
    try {
      await api.trade.bindOrder(params)
      this.setState({
        barCode: '',
        randomCode: ''
      })
      Taro.showToast({
        title: '关联成功，请至订单列表查看',
        icon:'none'
      })
    } catch (e) {}
  }
  
  render () {
    const { barCode, randomCode, showModal, tips, tipImg } = this.state
    const { colors } = this.props
    
    return (
      <View className='bindOrder'>
        <NavBar
          title='线下订单关联'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='barCode'>
          <View className='line'>
            请输入或者扫码录入订单号
            <View className='iconfont icon-info' onClick={this.showTips.bind(this, 1)}></View>
          </View>
          <View className='input'>
            <Input className='text' value={barCode} type='text' placeholder='订单号' onInput={this.inputChange.bind(this, 'barCode')} />
            <View className='iconfont icon-scan' onClick={this.scanCode.bind(this)}></View>
          </View>
        </View>
        <View className='barCode'>
          <View className='line'>
            请输入订单随机码
            <View className='iconfont icon-info' onClick={this.showTips.bind(this, 0)}></View>
          </View>
          <View className='input'>
            <Input className='text' value={randomCode}type='text' placeholder='随机码' onInput={this.inputChange.bind(this, 'randomCode')} />
          </View>
        </View>
        <View
          className='btn'
          style={`background: ${colors.data[0].primary}`}
          onClick={this.bindOrder.bind(this)}
        >
          关联
        </View>
        <AtModal
          isOpened={showModal}
          className='tipsModal'
          onClose={this.hideModal.bind(this)}
        >
          <AtModalContent>
            { tips }
            <Image src={tipImg} className='img' mode='aspectFit' />
          </AtModalContent>
          <AtModalAction>
            <View className='confirm' onClick={this.hideModal.bind(this)} style={`background: ${colors.data[0].primary}`}>确认</View>
          </AtModalAction>
        </AtModal>
      </View>
    ) 
  }
}