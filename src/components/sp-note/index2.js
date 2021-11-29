import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'

import './index2.scss'

export default class NoteIndex extends Component {
  static options = {
    addGlobalClass: true
  }

  resolveUrl (img) {
    return `/assets/imgs/${img}`
  }

  render () {
    const { img, imgStyle, styles, className, isUrl } = this.props

    return (
      <View
        className={classNames('note', img ? 'note__has-img' : null, className)}
        // style={styleNames(styles)}
      >
        {
          img && (<Image
            className='note__img'
            mode='aspectFill'
            // style={styleNames(imgStyle)}
            src={isUrl ? img : this.resolveUrl(img)}
          />)
        }
        <Text calssName='note__text'>{this.props.children}</Text>
      </View>
    )
  }
}
