import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

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
    const { list } = this.props

    return (
      <ScrollView
        className='tags'
        scroll-y
      >
        {
          list.length > 0 &&
          list.map((item, idx) => {
            const isCurrent = this.state.curId === item.tag_id

            return (
              <View
                className={classNames('tag-item', isCurrent && 'active')}
                onClick={this.handleClickItem.bind(this, item.tag_id)}
                key={item.tag_id}
              >
                {item.tag_name}
              </View>
            )
          })
        }
      </ScrollView>
    )
  }
}
