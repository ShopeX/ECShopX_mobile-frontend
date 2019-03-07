import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss';

let wxParse
if (process.env.TARO_ENV === 'weapp') {
  wxParse = require('@/components/wxParse/wxParse')
}

export default class HtmlContent extends Component {
  static defaultProps = {
    content: ''
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      const { content } = this.props
      wxParse.wxParse('content', 'html', content, this.$scope, )
    }
  }

  render () {
    const { className } = this.props
    const classes = classNames('html-content', className)

    return process.env.TARO_ENV === 'weapp'
      ? (<View className={classes}>
          <import src='../../components/wxParse/wxParse.wxml' />
          <template is='wxParse' data='{{wxParseData:content.nodes}}'/>
        </View>)
      : (<View className={classes} dangerouslySetInnerHTML={{ __html: this.props.content }}/>)
  }
}
