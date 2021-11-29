import React, { Component } from 'react';
import { View, Button } from '@tarojs/components'

import './item.scss'

export default class Index extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClick: null,
    iconPrefixClass: 'sp-icon',
    icon: '',
    openType: null,
    hide: false
  }

  render() {
    const { onClick, openType, iconPrefixClass, hide, icon, sessionFrom } = this.props

    return (
      <Button
        className={`float-menu__item ${hide ? 'hidden' : ''}`}
        onClick={onClick}
        openType={openType}
        sessionFrom={sessionFrom || ''}
      >
        <View className={`${iconPrefixClass} ${iconPrefixClass}-${icon}`}></View>
        {this.props.children}
      </Button>
    )
  }
}
