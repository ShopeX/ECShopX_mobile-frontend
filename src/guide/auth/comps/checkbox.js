import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'

import './checkbox.scss'

export default class RGCheckbox extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    checked: false,
    disabled: false,
    onChange: () => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      isChecked: this.props.checked
    }
  }

  componentWillReceiveProps (nextProps) {
    const { checked } = nextProps

    if (checked !== this.state.isChecked) {
      this.setState({
        isChecked: checked
      })
    }
  }

  handleClick = () => {
    if (this.props.disabled) return

    const isChecked = !this.state.isChecked
    this.setState({
      isChecked
    })
    this.props.onChange && this.props.onChange(isChecked)
  }

  render () {
    const { isChecked } = this.state

    return (
      <View className={classNames('reg-checkbox__wrap')} onClick={this.handleClick}>
        <View className='reg-checkbox'>
          <View className={isChecked ? 'at-icon at-icon-check' : ''}></View>
        </View>
        <Text className='reg-checkbox__label'>{this.props.children}</Text>
      </View>
    )
  }
}
