import Taro, { Component } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { connect } from "@tarojs/redux"

import "./destory-comfirm-modal.scss"

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class SettingIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
    };
  }

  render() {
    const { visible, onCancel, confirmBtn, cancelBtn, content, title, colors } = this.props
    return (
      visible
      ? <View className='destory-comfirm-modal'>
          <View className='content'>
            <View className='title' style={cancelBtn ? { color: '#D9001B' } : { color: '#666' }}>{title}</View>
            <View>{content}</View>
            <View onClick={() => onCancel('confirm')} className='confirm-button' style={`background: ${colors.data[0].primary}`}>{confirmBtn}</View>
            { cancelBtn && <View onClick={() => onCancel('cancel')} className='cancel-button'>{cancelBtn}</View> }
          </View>
        </View>
      : null
    )
  }
}
