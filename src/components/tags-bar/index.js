import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { classNames } from '@/utils'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class TagsBar extends Component {
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
    const { list, colors } = this.props

    return (
      <ScrollView className='tags' scrollX>
        {list.length > 0 &&
          list.map((item, idx) => {
            const isCurrent = this.state.curId === item.tag_id

            return (
              <View
                className='tag-item'
                style={isCurrent ? `color: ${colors.data[0].primary}` : `color: inherit;`}
                onClick={this.handleClickItem.bind(this, item.tag_id)}
                key={item.tag_id}
              >
                {item.tag_name}
              </View>
            )
          })}
      </ScrollView>
    )
  }
}
