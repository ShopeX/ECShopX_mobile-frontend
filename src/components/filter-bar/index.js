import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { classNames } from '@/utils'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
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
    const { list, className, custom, colors } = this.props
    const { sortOrder, curIdx } = this.state

    return (
      <View className={classNames('filter-bar', className)}>
        {custom &&
          list.map((item, idx) => {
            const isCurrent = curIdx === idx

            return (
              <View
                className={classNames(
                  'filter-bar__item',
                  isCurrent && 'filter-bar__item-active',
                  item.key && `filter-bar__item-${item.key}`,
                  item.sort
                    ? `filter-bar__item-sort filter-bar__item-sort-${
                        sortOrder > 0 ? 'asc' : 'desc'
                      }`
                    : null
                )}
                style={isCurrent ? 'color: ' + colors.data[0].primary : 'color: #999999'}
                onClick={this.handleClickItem.bind(this, idx)}
                key={item.title}
              >
                <Text className='filter-bar__item-text'>{item.title}</Text>
                <View className='active-bar' style={'background: ' + colors.data[0].primary}></View>
              </View>
            )
          })}
        {this.props.children}
      </View>
    )
  }
}
