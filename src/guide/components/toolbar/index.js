import React, { PureComponent } from 'react';
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import S from '@/spx'

import './index.scss'

export default class SpToolbar extends PureComponent {
  static options = {
    addGlobalClass: true
  }

  defaultProps = {
    inline: false
  }

  render() {
    const { inline } = this.props
    const ipxClass = S.get('ipxClass') || ''

    return (
      <View className={classNames('sp-toolbar', { 'sp-toolbar__inline': inline }, ipxClass)}>
        {this.props.children}
      </View>
    )
  }
}
