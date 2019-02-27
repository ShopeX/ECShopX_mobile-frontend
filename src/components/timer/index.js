import Taro, { Component } from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class Timer extends Component {
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
      sent: false
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    this.stop()
  }

  handleClick = () => {
    if (this.timer) return

    if (!this.timer) {
      this.start()
    }
    this.setState({
      sent: true
    })
  }

  start () {
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
            countDur: this.props.duration
          })
          this.props.onStop && this.props.onStop()
        }
      }, 1000)
    }

    if (this.props.onStart(this.state.countDur) !== false) {
      next()
    }
  }

  stop () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  render () {
    const { timer } = this
    const { countDur, sent } = this.state
    const { timerMsg, className } = this.props
    const msg = timerMsg || (timer
      ? `${countDur}s`
      : sent
        ? this.props.msg
        : this.props.defaultMsg)

    return (
      <Text
        className={classNames('mobile-timer', { 'mobile-timer__counting': timer }, className)}
        onClick={this.handleClick}
      >
        {msg}
      </Text>
    )
  }
}
