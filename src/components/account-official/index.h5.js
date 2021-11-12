import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './index.scss'

export default class AccountOfficial extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {}

  constructor (props) {
    super(props)

    this.state = {}
  }
  componentDidMount () {}

  componentDidShow () {}

  render () {
    return <View className='account-view'></View>
  }
}
