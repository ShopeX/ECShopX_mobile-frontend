import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

export default class FilterBar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    sort: {},
    current: 0,
    list: []
  }

  constructor (props) {
    super(props)

    const { current } = props
    this.state = {
      curIdx: current,
      sortOrder: null
    }
  }

  handleClickItem (idx) {
    const item = this.props.list[idx]
    let sortOrder = null

    if (item.sort) {
      sortOrder = idx === this.state.curIdx ? this.state.sortOrder * -1 : item.sort
    }

    this.setState({
      curIdx: idx,
      sortOrder
    })

    this.props.onChange({
      current: idx,
      sort: sortOrder
    })
  }

  render () {
    const { list, className, custom } = this.props
		const { sortOrder, curIdx } = this.state

    return (
      <View className={classNames('filter-bar', className)}>
        {
          custom &&
          list.map((item, idx) => {
            const isCurrent = curIdx === idx

            return (
              <View
                className={classNames('filter-bar__item', isCurrent && 'filter-bar__item-active', item.key && `filter-bar__item-${item.key}`, item.sort ? `filter-bar__item-sort filter-bar__item-sort-${sortOrder > 0 ? 'asc' : 'desc'}` : null)}
                onClick={this.handleClickItem.bind(this, idx)}
                key={item.title}
              >
                <Text className='filter-bar__item-text'>{item.title}</Text>
              </View>
            )
          })
        }
        {this.props.children}
      </View>
    )
  }
}
