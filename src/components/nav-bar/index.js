import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'

import './index.scss'

export default class NavBar extends Component {
  static defaultProps = {
  }

  constructor (props) {
    super(props)

    this.state = {
    }
  }

  static options = {
    addGlobalClass: true
  }

  handleClickBack = () => {
    Taro.navigateBack({
      delta: 1
    })
  }

  render () {
    const { title, leftIconType, fixed } = this.props
    console.log(fixed)
    return (
      <View className='nav-bar-height'>
        <AtNavBar
          fixed={fixed}
          color='#000'
          title={title}
          leftIconType={leftIconType}
          onClickLeftIcon={leftIconType ? this.handleClickBack : ''}
        />
      </View>
    )
  }
}
