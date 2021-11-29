import React, { Component } from 'react';
import { View, Text } from '@tarojs/components'
import { classNames, navigateTo } from '@/utils'
import SpLoading from '../sp-loading'
import SpNote from '../sp-note'

import './index.scss'

export default class SpPageNote extends Component {
  static defaultProps = {
    info: null,
    to: ''
  }

  static options = {
    addGlobalClass: true
  }

  navigateTo = navigateTo

  handleClick = () => {}

  render() {
    const { info: page, className, title, button, value, btnText, to } = this.props
    if (!page) {
      return null
    }
    return (
      <View className={classNames('sp-page-note', className)}>
        {page.isLoading && <SpLoading>正在加载...</SpLoading>}
        {page.done && page.total == 0 && (
          <SpNote icon title='没有查询到数据' button btnText='去逛逛' to={to} />
        )}
        {!page.isLoading && !page.hasNext && page.total > 0 && (
          <SpNote className='no-more' title='--没有更多数据了--'></SpNote>
        )}
      </View>
    )
  }
}
