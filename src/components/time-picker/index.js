import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { classNames } from '@/utils'

export default class TimePicker extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  onChange = (e) => { 
    const { onselctedTime } = this.props 
    onselctedTime(e.detail.value)
  }

  render() {
    return (
      <View className='time-picker'>
        <View>
          <Picker mode='time' start='0:00' end='23:59' onChange={this.onChange}>
            {this.props.children}
          </Picker>
        </View>
      </View>
    )
  }
}
