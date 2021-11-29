import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, styleNames } from '@/utils'

import './comp-banner.scss'

function CompsBanner(props) {
  const { className, src, info } = props
  
  const handleClick = () => {
    const { urlOpen, pageUrl, appId } = info
    if ( urlOpen ) {
      Taro.navigateToMiniProgram({
        appId: appId,
        path: pageUrl
      })
    }
  }
  return (
    <View
      className={classNames(
        {
          'comp-banner': true
        },
        className
      )}
      onClick={handleClick}
    >
      <SpImage src={src} />
    </View>
  )
}

CompsBanner.options = {
  addGlobalClass: true
}

export default CompsBanner
