import Taro, { useMemo, memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import mpHtml from './mp-weixin'

function SpHtml (props) {
  const { content } = props
  console.log('content:', content)
  return (
    <View className='sp-html'>
      <mpHtml content={content} />
    </View>
  )
}

SpHtml.config = {
  usingComponents: {
    'mp-html': './mp-weixin/index'
  }
}

SpHtml.options = {
  addGlobalClass: true
}

export default SpHtml
