import Taro, { useState, memo } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { classNames, getNavbarHeight } from '@/utils'
import './index.scss'

const SpNewInput = (props) => {
  const { placeholder = '', isStatic = false, onClick = () => {}, onConfirm = () => {} } = props

  const [value, setValue] = useState('')

  const handleInput = ({ detail: { value } }) => {
    setValue(value)
  }

  const handleConfirm = ({ detail: { value } }) => {
    onConfirm && onConfirm(value)
  }

  return (
    <View className={classNames('sp-component-newinput')}>
      <View className={classNames('sp-component-newinput-icon')}>
        <View className='iconfont icon-sousuo-01'></View>
      </View>
      <View className={classNames('sp-component-newinput-placeholder')}>
        <View className='text' onClick={onClick}>
          {isStatic ? (
            placeholder
          ) : (
            <Input
              className='input'
              value={value}
              onInput={handleInput}
              onConfirm={handleConfirm}
              placeholder={placeholder}
              placeholderClass='placeholderClass'
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default memo(SpNewInput)
