import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import configStore from '@/store'

import './index.scss'

const store = configStore()
export default class HomeCapsule extends Component {
  static defaultProps = {
    url: ''
  }

  render () {
    const { className, point, plus, isGoodCard, isStoreOut } = this.props
    const classes = classNames('point-line', className, { plus: plus })

    return (
      <View
        className={classNames(classes, [{ isGoodCard: isGoodCard }, { isStoreOut: isStoreOut }])}
      >
        <View className='number'>{point}</View>
        <View className='text'>{store.getState().sys.pointName}</View>
      </View>
    )
  }
}
