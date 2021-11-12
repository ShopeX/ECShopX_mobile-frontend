import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

export default class SpTagBar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    current: '',
    list: []
  }

  constructor (props) {
    super(props)

    const { current } = props
    this.state = {
      curId: current
    }
  }

  handleClickItem (id) {
    this.setState({
      curId: id
    })
    this.props.onChange({
      current: id
    })
  }

  render () {
    const { list } = this.props
    const { curId } = this.state

    return (
      <ScrollView className='sp-tag-bar' scrollX>
        {/* <View className="tag-bar-container"> */}
        {list.map((item) => (
          <View
            className={classNames('tag-item', {
              active: curId === item.tag_id
            })}
            onClick={this.handleClickItem.bind(this, item.tag_id)}
            key={item.tag_id}
          >
            {item.tag_name}
          </View>
        ))}
        {/* </View> */}
      </ScrollView>
    )
  }
}
