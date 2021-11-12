/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 是否需要包装
 * @FilePath: /unite-vshop/src/pages/cart/comps/selectPackage/index.js
 * @Date: 2020-11-06 11:01:46
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-26 20:18:13
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { SpCheckbox, SpCell } from '@/components'
import { AtActionSheet } from 'taro-ui'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class SelectPackage extends Component {
  defaultProps = {
    isChecked: false,
    onHanleChange: null,
    packInfo: {}
  }

  constructor (props) {
    super(props)
    this.state = {
      isOpend: false,
      checked: false
    }
  }

  componentDidMount () {
    const { isChecked } = this.props
    this.setState({
      checked: isChecked
    })
  }

  componentWillReceiveProps (next) {
    const { checked } = this.state
    if (next.isChecked !== checked) {
      setTimeout(() => {
        this.setState({
          checked: next.isChecked
        })
      })
    }
  }

  showSheet = () => {
    const { isChecked } = this.props
    this.setState({
      isOpend: true,
      checked: isChecked
    })
  }

  // 更改选项
  handleChange = (isCheck) => {
    const { checked } = this.state
    if (checked === isCheck) return false
    this.setState({
      checked: isCheck
    })
  }

  // 触发props
  handleConfrim = () => {
    const { checked } = this.state
    this.setState(
      {
        isOpend: false
      },
      () => {
        this.props.onHanleChange && this.props.onHanleChange(checked)
      }
    )
  }

  handleClose = () => {
    this.setState({
      isOpend: false
    })
  }
  render () {
    const { isOpend, checked } = this.state
    const { isChecked, packInfo = {}, colors, isPointitem = false } = this.props
    return (
      <View className=''>
        {!isPointitem && (
          <SpCell
            isLink
            className='trade-invoice'
            title={packInfo.packName}
            onClick={this.showSheet.bind(this)}
          >
            <View className='invoice-title'>{isChecked ? '需要' : '不需要'}</View>
          </SpCell>
        )}

        <AtActionSheet isOpened={isOpend} onClose={this.handleClose}>
          <View className='payment-picker'>
            <View className='payment-picker__hd'>
              <Text>{packInfo.packName}</Text>
            </View>
            <View className='payment-picker__bd'>
              <View
                className='payment-item no-border'
                onClick={this.handleChange.bind(this, false)}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>不需要</Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox colors={colors} checked={!checked} />
                </View>
              </View>

              <View className='payment-item no-border' onClick={this.handleChange.bind(this, true)}>
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>需要</Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox colors={colors} checked={checked} />
                </View>
              </View>
              <View className='payment-item__desc'>{packInfo.packDes}</View>
            </View>
            <Button
              type='primary'
              className='btn-submit'
              style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};`}
              onClick={this.handleConfrim.bind(this)}
            >
              确定
            </Button>
          </View>
        </AtActionSheet>
      </View>
    )
  }
}
