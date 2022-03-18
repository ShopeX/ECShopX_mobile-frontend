import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { classNames, styleNames } from '@/utils'
import { connect } from 'react-redux'
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
export default class WgtFixedInput extends Component {
  static defaultProps = {
    info: {}
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  static options = {
    addGlobalClass: true,
    isfix: false
  }

  componentWillReceiveProps(nextProps) {
    const { info } = this.props
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

  handleConfirm = (e) => {
    const { onHomesearchfocus } = this.props
    onHomesearchfocus(true)
  }

  render() {
    const { info } = this.props
    let { isfix } = this.state
    if (!info.config) return
    const { config } = info

    return (
      <View>
        <View className={classNames('scroll-input s_fixed', isfix ? 'o_pacity' : 'o_pacity_t')}>
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
