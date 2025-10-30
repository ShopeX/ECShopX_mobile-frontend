// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import { isWeb, isAlipay, htmlStringToNodeArray, isWeixin } from '@/utils'

function SpHtml(props) {
  const { content = '' } = props
  let _content = content
    .toString()
    .replace(/\s+style="[^"]*"/g, '')
    .replace(/<img/g, '<img style="width:100%;height:auto;display: block;"')
  if (isAlipay) {
    _content = htmlStringToNodeArray(_content)
  }
  // console.log('content:', _content)
  return (
    <View className='sp-html'>
      {isWeb && <View dangerouslySetInnerHTML={{ __html: _content }} />}
      {isWeixin && <mp-html content={_content} />}
      {isAlipay && <RichText nodes={_content} />}
    </View>
  )
}

SpHtml.options = {
  addGlobalClass: true
}

export default SpHtml
