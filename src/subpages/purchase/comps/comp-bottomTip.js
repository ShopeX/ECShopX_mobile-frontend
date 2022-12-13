import { View } from '@tarojs/components'
import './comp-bottomTip.scss'

function CompsBanner () {

  return (
    <View className='end-text'>* 本功能仅供企业内部人员使用，不对外开放</View>
  )
}

CompsBanner.options = {
  addGlobalClass: true
}

export default CompsBanner
