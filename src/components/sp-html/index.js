import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { isWeb } from '@/utils'

function SpHtml(props) {
  const { content = '' } = props
  const _content = content.toString()
    .replace(/\s+style="[^"]*"/g, '')
    .replace(/<img/g, '<img style="width:100%;height:auto;display: block;"')
  // console.log('content:', _content)
  return (
    <View className='sp-html'>
      {isWeb && <View dangerouslySetInnerHTML={{ __html: _content }} />}
      {!isWeb && <mp-html content={_content} />}
    </View>
  )
}

SpHtml.options = {
  addGlobalClass: true
}

export default SpHtml
