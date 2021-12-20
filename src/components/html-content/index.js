import React, { Component } from 'react';
import { View,RichText } from '@tarojs/components'
import { classNames,isWeixin,isAlipay } from '@/utils'

import './index.scss';

let wxParse
if (isAlipay) {
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
    if (isWeixin||isAlipay) {
      const { content } = this.props 
      // console.log(content, 24)
      wxParse.wxParse('article', 'html', content, this.$scope, 5)
    }
  }

  render () {
    const { className } = this.props
    const classes = classNames('html-content', className) 

    return process.env.TARO_ENV === 'alipay'
      ? (
        <View className={classes}>
          <RichText nodes={article.nodes}></RichText>
          {/* <import src='../wxParse/wxParse.axml' />
          <template is='wxParse' data='{{wxParseData:article.nodes}}' /> */}
        </View>
      )
      : (<View className={classes} dangerouslySetInnerHTML={{ __html: this.props.content }} />)
  }
}
