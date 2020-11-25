/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 是否需要包装
 * @FilePath: /zippo-h5/src/pages/screen/components/selectPackage/index.js
 * @Date: 2020-11-06 11:01:46
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-06 14:20:51
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpCheckbox } from '@/components'
import { AtActionSheet } from 'taro-ui'


import './index.scss'

export default class SelectPackage extends Component {
  defaultProps = {
    isChecked: false,
    onHanleChange: null
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
    this.setState({
      isOpend: false
    }, () => {
      this.props.onHanleChange && this.props.onHanleChange(checked)
    })
  }

  render () {
    const { isOpend, checked } = this.state
    const { isChecked } = this.props

    const colors = {data: [{primary: '#000'}]}

    return (
      <View className='selectPackage'>
        <View className='showline' onClick={this.showSheet.bind(this)}>
          <View className='left'>礼包</View>
          <View className='right'>
            { isChecked ? '需要' : '不需要'}
            <Text className='iconfont icon-arrowRight'></Text>
          </View>
        </View>
        <AtActionSheet
          className='sheet'
          title='是否需要礼袋'
          isOpened={isOpend}
        >
          <View className='line' onClick={this.handleChange.bind(this, false)}>
            不需要
            <SpCheckbox
              colors={colors}
              checked={!checked}
            />
          </View>
          <View className='needline' onClick={this.handleChange.bind(this, true)}>
            <View className='line'>
              需要
              <SpCheckbox
                colors={colors}
                checked={checked}
              />                
            </View>
            <View className='ext'>礼袋说明文字礼袋说明文字礼袋说明文字</View>         
          </View>
          <View className='btn' onClick={this.handleConfrim.bind(this)}>确认</View>
        </AtActionSheet>
      </View>
    )
  }
}