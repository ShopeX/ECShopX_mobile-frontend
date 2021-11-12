import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import { connect } from '@tarojs/redux'
import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class AtTabslist extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    tabList: [],
    onClick: () => {}
  }
  constructor (props) {
    super(props)
    this.state = {
      current: 0
    }
  }

  handleClick (value) {
    this.setState(
      {
        current: value
      },
      () => {
        this.props.onClick(value)
      }
    )
  }

  render () {
    const { current } = this.state
    const { tabList, colors } = this.props
    return (
      <View className='outer'>
        {tabList.map((item, index) => {
          return (
            <View
              key={`${index}1`}
              className='tab_li'
              style={current === index ? 'color:' + colors.data[0].primary : null}
              onClick={this.handleClick.bind(this, index)}
            >
              {item.tabTitle}
            </View>
          )
        })}
      </View>
    )
  }
}
