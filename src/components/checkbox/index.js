import React, { Component } from 'react';
import { View } from '@tarojs/components' 
import { classNames, styleNames, getThemeStyle } from '@/utils'
import './index.scss'
 
export default class SpCheckbox extends Component {
  static defaultProps = {
    checked: false,
    disabled: false,
    onChange: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      isChecked: this.props.checked
    }
  }

  componentWillReceiveProps(nextProps) {
    const { checked } = nextProps

    if (checked !== this.state.isChecked) {
      this.setState({
        isChecked: checked
      })
    }
  }

  static options = {
    addGlobalClass: true
  }

  handleClick = (e) => {
    if (this.props.disabled) return
    const isChecked = !this.state.isChecked
    this.setState({
      isChecked
    })
    this.props.onChange && this.props.onChange(isChecked)
  }

  render() { 
    const { isChecked } = this.state

    return (
      <View
        className={classNames(
          "sp-checkbox__wrap",
          isChecked ? "sp-checkbox__checked" : null
        )}
        onClick={this.handleClick.bind(this)}
        style={styleNames(getThemeStyle())}
      >
        <View className="sp-checkbox">
          <View className="iconfont icon-check"></View>
        </View>
        <View className="sp-checkbox__label">{this.props.children}</View>
      </View>
    );
  }
}
