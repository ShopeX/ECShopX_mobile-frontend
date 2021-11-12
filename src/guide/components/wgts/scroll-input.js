import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import { connect } from '@tarojs/redux'

import './search-home.scss'

@connect(
  (store) => ({
    homesearchfocus: store.home.homesearchfocus
  }),
  (dispatch) => ({
    onHomesearchfocus: (homesearchfocus) =>
      dispatch({ type: 'home/homesearchfocus', payload: homesearchfocus })
  })
)
export default class WgtScrollInput extends Component {
  static defaultProps = {
    info: {}
  }

  constructor(props) {
    super(props)

    this.state = {
      isfix: false,
      flag: true
    }
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const { info } = this.props
    //console.log('info.config.isScroll-----1',info.config.isScroll,nextProps.scrollflag!==this.props.scrollflag)
    if (nextProps.scrollflag !== this.props.scrollflag) {
      if (info.config && info.config.isScroll) {
        this.setState({
          isfix: nextProps.scrollflag
        })
      }
    }
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps.scrollflag === this.props.scrollflag) return false
  }

  componentDidHide() {}

  handleConfirm = (e) => {
    const { onHomesearchfocus, dispatch } = this.props
    onHomesearchfocus(true)
  }

  render() {
    const { info, scrollflag, isOpenStore } = this.props
    let { isfix } = this.state
    if (!info.config) return
    const { config } = info

    let top = null

    if (!isOpenStore) {
      top = 0
    } else {
      top = 200
    }

    return (
      <View>
        <View
          className={classNames('scroll-input', isfix ? 'o_pacity_t' : 'o_pacity')}
          style={`top:${top}rpx`}
        >
          <View
            className={classNames('home-search-input')}
            style={styleNames({
              'background-color': config.backgroundColor || 'rgba(255, 255, 255, 0.21)'
            })}
            onClick={this.handleConfirm}
          >
            <Text style={styleNames({ 'color': config.placeholderColor || '#808080' })}>
              | {config.searchplaceholder || ' 护肤/彩妆/面膜/指甲油'}
            </Text>{' '}
            <View
              className='in-icon in-icon-xunzhao'
              style={styleNames({ 'color': config.iconColor || '#808080' })}
            ></View>
          </View>
        </View>
      </View>
    )
  }
}
