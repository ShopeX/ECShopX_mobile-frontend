import React, { Component } from 'react'
import { Text } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

export default class SpTimer extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    duration: 60,
    defaultMsg: '发送验证码',
    msg: '重新发送'
  }

  constructor (props) {
    super(props)

    this.state = {
      countDur: props.duration,
      //表示是否已经结束倒计时
      sent: false,
      //表示是否已经完成倒计时
      finish: false
    }
  }

  componentWillUnmount () {
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

  stop () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  render () {
    const { countDur, sent, finish } = this.state
    const { timerMsg, className, style = '' } = this.props

    //发送中
    const is_sending = sent && !finish

    const msg =
      timerMsg || (is_sending ? `${countDur}s` : finish ? this.props.msg : this.props.defaultMsg)

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
