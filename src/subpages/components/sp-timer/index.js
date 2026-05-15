/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { Text } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { classNames } from '@/utils'
import './index.scss'

class SpTimer extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    duration: 60,
    defaultMsg: '',
    msg: ''
  }

  constructor(props) {
    super(props)

    this.state = {
      countDur: props.duration,
      //表示是否已经结束倒计时
      sent: false,
      //表示是否已经完成倒计时
      finish: false
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  handleClick = () => {
    if (this.timer) return

    if (!this.timer) {
      this.start()
    }
  }

  start = () => {
    this.stop()

    const next = () => {
      this.timer = setTimeout(() => {
        const countDur = this.state.countDur - 1
        this.props.onUpdateTimer && this.props.onUpdateTimer(countDur)
        this.setState({
          countDur
        })
        if (countDur > 0) {
          next()
        } else {
          this.stop()
          this.setState({
            countDur: this.props.duration,
            finish: true
          })
          this.props.onStop && this.props.onStop()
        }
      }, 1000)
    }

    this.props.onStart((start) => {
      if (start !== false) {
        this.setState(
          {
            sent: true,
            finish: false
          },
          () => next()
        )
      }
    }, this.state.countDur)
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  render() {
    const { countDur, sent, finish } = this.state
    const { timerMsg, className, style = '', t } = this.props

    //发送中
    const is_sending = sent && !finish

    const msg =
      timerMsg ||
      (is_sending
        ? `${countDur}s`
        : finish
        ? this.props.msg || t('0eb8dfea.89b213')
        : this.props.defaultMsg || t('0eb8dfea.c5c358'))

    return (
      <Text
        className={classNames('mobile-timer', { 'mobile-timer__counting': is_sending }, className)}
        style={style}
        onClick={this.handleClick}
      >
        {msg}
      </Text>
    )
  }
}

export default withTranslation()(SpTimer)
