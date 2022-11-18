import Taro from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import { isWeb, isAlipay, htmlStringToNodeArray, isWeixin } from '@/utils'
function SpHtml(props) {
  const { content = '' } = props
  let _content = content.toString()
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
