import Taro from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpUpload } from '@/components'
import { AtList, AtListItem, AtTextarea } from 'taro-ui'
import './comp-shipping-information.scss'

const CompShippingInformation = (props) => {
  const { selector, deliveryItem = () => {} } = props

  const onChange = (item, index, e) => {
    console.log('取消', item, index, e)
    let newSelector = JSON.parse(JSON.stringify(selector))
    if(item.status == 'input'){
      newSelector[index].selector.forEach((element) => {
        element.status = false
      })
      newSelector[index].selector[e.detail.value].status = true
    }else{
      newSelector[index].selector = e
    }
    deliveryItem(newSelector)
  }

  return (
    <View className='comp-shipping-information'>
      {selector.map((item, index) => {
        return (
          <View key={index}>
            {item.status == 'input' && (
              <Picker
                mode='selector'
                rangeKey='label'
                range={item.selector}
                onChange={(e) => onChange(item, index, e)}
              >
                <AtList>
                  <AtListItem title={item.title} extraText={item.extraText} />
                </AtList>
              </Picker>
            )}
            {item.status == 'textarea' && (
              <View className='textarea-name'>
                <Text className='title'>{item.title}</Text>
                <AtTextarea
                  value={item.value}
                  onChange={(e) => onChange(item, index, e)}
                  maxLength={item.maxLength || 200}
                  placeholder={item.placeholder || '请输入...'}
                />
              </View>
            )}
            {item.status == 'image' && (
              <View className='image-name'>
                <Text className='title'>{item.title}</Text>
                <SpUpload
                  value={item.selector}
                  max={3}
                  placeholder='添加图片'
                  onChange={(e) => onChange(item, index, e)}
                />
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}

CompShippingInformation.options = {
  addGlobalClass: true
}

export default CompShippingInformation
