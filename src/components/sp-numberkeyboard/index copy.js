import Taro, { Component } from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { classNames, isNumber, vaildPrice } from '@/utils'

import './index.scss'
import { SwPrice } from '..'

const ret = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
export default class SwNumberKeyBoard extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    className: null,
    maxValue: 0,
    value: 0,
    onClose: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      currentValue: '0'
    }
  }

  handleClickItem = (key) => {
    let _currentValue = this.state.currentValue
    if (isNumber(key) || key == '.') {
      _currentValue = `${_currentValue == '0' ? '' : _currentValue}${key}`
    }

    if (
      !/\./.test(_currentValue) || // 首位不含.
      (!/^\./.test(_currentValue) && //
        !/\.\d{3}/.test(_currentValue) &&
        _currentValue.match(/\./g).length <= 1)
    ) {
      this.setState({
        currentValue: _currentValue
      })
    }

    switch (key) {
      case 'close':
        this.props.onClose()
        break
      case 'clear':
        this.setState({
          currentValue: '0'
        })
        break
      case 'ok':
        this.props.onConfirm(_currentValue)
        break
      default:
        break
    }
  }

  // 使用全部
  handleClickUseAll() {
    const { maxValue } = this.props
    this.setState({
      currentValue: maxValue.toString()
    })
  }

  isDisabled() {
    const { currentValue } = this.state
    const { maxValue } = this.props
    return !(ret.test(this.state.currentValue) && parseFloat(currentValue) <= maxValue)
  }

  render() {
    const { maxValue, value } = this.props
    const { currentValue } = this.state
    return (
      <View className='sw-numberkeyboard'>
        <View className='display-col'>
          <View className='title'>
            可用余额: <SwPrice value={maxValue}></SwPrice>
            <Text className='all-use' onClick={this.handleClickUseAll.bind(this)}>
              全部使用
            </Text>
          </View>
          <View className='display-con'>{currentValue}</View>
        </View>
        <View className='row-root row'>
          <View className='col'>
            <View className='row'>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 1)}>
                1
              </View>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 2)}>
                2
              </View>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 3)}>
                3
              </View>
            </View>
            <View className='row'>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 4)}>
                4
              </View>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 5)}>
                5
              </View>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 6)}>
                6
              </View>
            </View>
          </View>
          <View className='col'>
            <View className='keyboard word' onClick={this.handleClickItem.bind(this, 'clear')}>
              清除
            </View>
          </View>
        </View>
        <View className='row-root'>
          <View className='col'>
            <View className='row'>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 7)}>
                7
              </View>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 8)}>
                8
              </View>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 9)}>
                9
              </View>
            </View>
            <View className='row'>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, '.')}>
                .
              </View>
              <View className='keyboard' onClick={this.handleClickItem.bind(this, 0)}>
                0
              </View>
              <View className='keyboard word' onClick={this.handleClickItem.bind(this, 'close')}>
                关闭
              </View>
            </View>
          </View>
          <View
            className={classNames(`col btn-ok__con`, {
              disabled: this.isDisabled()
            })}
          >
            <View className='keyboard word' onClick={this.handleClickItem.bind(this, 'ok')}>
              确定
            </View>
          </View>
        </View>
      </View>
    )
  }
}
