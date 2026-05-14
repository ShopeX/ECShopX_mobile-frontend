/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import { classNames } from '@/utils'
import { i18n } from '@/i18n'
import './index.scss'

export default class GoodsComment extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    isOpened: false,
    onClose: () => {}
  }

  constructor(props) {
    super(props)

    this.state = {
      isActive: props.isOpened,
      comment: '',
      input_bottom: 0,
      count: 0
    }
  }
  componentDidMount() {
    this._onI18n = () => this.forceUpdate()
    i18n.on('languageChanged', this._onI18n)
  }

  componentWillUnmount() {
    i18n.off('languageChanged', this._onI18n)
  }

  componentWillReceiveProps(nextProps) {
    const { isOpened } = nextProps
    if (isOpened !== this.state.isActive) {
      this.setState({
        isActive: isOpened
      })
    }
  }

  toggleShow = (isActive) => {
    if (isActive === undefined) {
      isActive = !this.state.isActive
    }

    this.setState({ isActive })
    this.props.onClose && this.props.onClose()
  }

  handleClickReply = async () => {
    const { comment } = this.state
    if (!comment || !comment.length) {
      return
    }
    this.props.onReplyRate && this.props.onReplyRate(comment)
    this.setState({
      comment: '',
      isActive: false,
      count: 0
    })
  }

  setinputtop = (e) => {
    console.log('键盘高度变化', e, e.detail.height)
    let het = e.detail.height - 0
    this.setState({
      input_bottom: het
    })
  }

  handleChange(e) {
    let comment = e.detail.value
    this.setState({
      comment,
      count: comment ? comment.length : 0
    })
  }

  render() {
    const { isActive, comment, count, input_bottom } = this.state

    return (
      <View
        className={classNames(
          'goods-comment-panel',
          isActive ? 'goods-comment-panel__active' : null
        )}
      >
        <View
          className='goods-comment-panel__overlay'
          onClick={() => this.toggleShow(false)}
        ></View>

        <View className='goods-comment-panel__wrap'>
          <View
            className='goods-comment-panel__bd'
            style={{ paddingBottom: `${input_bottom - 0 + 10}px` }}
          >
            <Textarea
              className='comment'
              adjustPosition={false}
              value={comment}
              onInput={this.handleChange.bind(this)}
              placeholder={i18n.t('008ef341.ff5227')}
              onKeyboardHeightChange={this.setinputtop.bind(this)}
            />
            <View className='reply-btns'>
              <Text className='count'>{count}/500</Text>
              <View
                className={classNames('btn', { 'btn-disabled': count == 0 })}
                onClick={this.handleClickReply}
              >
                {i18n.t('008ef341.e621fe')}
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
