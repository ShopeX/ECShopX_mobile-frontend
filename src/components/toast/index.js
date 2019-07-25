import Taro, { Component } from '@tarojs/taro'
import { AtToast } from 'taro-ui'
import { isObject } from '@/utils'

function resolveState (props = {}, state = {}) {
  const ret = {
    ...props,
    ...state
  }

  return ret
}

export default class SpToast extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showToast: false,
      text: ''
    }

    Taro.eventCenter.on('sp-toast:show', this.handleShow)
    Taro.eventCenter.on('sp-toast:close', this.handleClose)
  }

  componentWillUnmount () {
    Taro.eventCenter.off('sp-toast:show', this.handleShow)
    Taro.eventCenter.off('sp-toast:close', this.handleClose)
  }

  handleShow = (text, config = {}) => {
    if (typeof text === 'string') {
      config = {
        ...config,
        text
      }
    } else if (isObject(text)) {
      config = {
        ...config,
        ...text
      }
    }

    this.setState({
      showToast: true,
      ...config
    })
  }

  handleClose = () => {
    this.setState({
      showToast: false
    })
  }

  render () {
    const { showToast, text } = this.state
    let newText = ''
    if(text.length > 11) {
      newText = text.substring(0, 11)+ '\n' + text.substring(11)
    } else {
      newText = text
    }
    const { icon, image, status, duration, hasMask } = resolveState(this.props, this.state)

    return (
      <AtToast
        icon={icon}
        image={image}
        status={status}
        duration={duration}
        hasMask={hasMask}
        isOpened={showToast}
        onClose={this.handleClose}
        text={newText}
      />
    )
  }
}
