import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames, navigateTo } from '@/utils'
import SpLoading from '../sw-loading'
import SpNote from '../sw-note'

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
        {page.isLoading && <SwLoading>正在加载...</SwLoading>}
        {page.done && page.total == 0 && (
          <SwNote icon title='没有查询到数据' button btnText='去逛逛' to={to} />
        )}
        {!page.isLoading && !page.hasNext && page.total > 0 && (
          <SwNote className='no-more' title='--没有更多数据了--'></SwNote>
        )}
      </View>
    )
  }
}
