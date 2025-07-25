import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

//import '../../font/iconfont.scss'
import './index.scss'

export default class TagsBar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    current: '',
    list: []
  }

  constructor(props) {
    super(props)

    this.state = {
      curId: ''
    }
  }
  componentWillReceiveProps(nextProps) {
    const { current } = nextProps
    this.setState({
      curId: current
    })
  }
  handleClickItem(id) {
    this.props.onChange(id)
  }
  delete(idx, e) {
    e && e.stopPropagation()
    this.props.delete(idx)
  }

  render() {
    const { list, isedit } = this.props
    const { curId } = this.state
    return (
      <ScrollView className='tags' scrollX>
        {list.length > 0 &&
          list.map((item, idx) => {
            const isCurrent = curId == item.topic_id

            return (
              <View
                className={isCurrent ? 'tag-item tag-item_active' : 'tag-item'}
                // style={isCurrent ? `color: ${colors.data[0].primary}` : `color: inherit;`}
                onClick={this.handleClickItem.bind(this, item.topic_id)}
                key={item.topic_id}
              >
                #{item.topic_name}
                {isedit && (
                  <View onClick={this.delete.bind(this, idx)} className='tag-item_delete'>
                    <View className='iconfont icon-tianjia1'></View>
                  </View>
                )}
              </View>
            )
          })}
      </ScrollView>
    )
  }
}
