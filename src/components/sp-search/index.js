import Taro, { Component } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
import './index.scss'

export default class SpSearch extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)
    this.state = {
      searchValue: '',
      historyList: [],
      isShowAction: false
    }
  }

  componentDidMount () {}

  handleClick = () => {
    Taro.navigateTo({
      url: `/pages/item/list`
    })
  }

  render () {
    return (
      <View className='sp-search' onClick={this.handleClick.bind(this)}>
        <View className='iconfont icon-sousuo-01'></View>
        <Text className='place-holder'>搜索</Text>
      </View>
    )
  }
}
