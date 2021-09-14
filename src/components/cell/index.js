import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

export default class SpCell extends Component {

  static defaultProps = {
    isLink: false,
    value: null,
    border: true,
    title: '',
    arrow: 'right',
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { isLink, value, icon, img, iconPrefix, title, onClick, arrow, border, className } = this.props

    let linkClassName=`sp-cell__ft-icon at-icon at-icon-chevron-${arrow}`;

    if(Taro.getEnv() == Taro.ENV_TYPE.ALIPAY){
      linkClassName='icon-arrowRight'
    }
    
    return (
      <View
        className={classNames('sp-cell', className, isLink ? 'sp-cell__is-link' : null, border ? null : 'sp-cell__no-border')}
        onClick={onClick}
      >
        {img && (
          <Image className='sp-cell__icon' src={img} mode="aspectFit"/>
        )}
        {icon && (
          <View className={`sp-cell__icon ${iconPrefix ? iconPrefix + ' ' + iconPrefix + '-' + icon : 'at-icon at-icon-' + icon}`}></View>
        )}
        <View className='sp-cell__hd'>
          {title && (
            <Text className='sp-cell__title'>{title}</Text>
          )}
        </View>
        <View className='sp-cell__bd'>
          {this.props.children}
        </View>
        <View className='sp-cell__ft'>
          {value && (
            <View className='sp-cell__value'>{value}</View>
          )}
        </View>
        {isLink && (
          <View className={linkClassName}></View>
        )}
      </View>
    )
  }
}
