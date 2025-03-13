import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

function SpInput(props) {
  const [cursor, setCursor] = useState(-1)

  useEffect(() => {
    setCursor(props.value.length)
  }, [props.value])

  const handleInput = (e) => {
    console.log('sp-input', e)
    setCursor(e.detail.cursor)
    props.onChange(e.detail.value)
  }

  const handleClear = () => {
    console.log('claer')
    setCursor(-1)
    props.onChange('')
  }

  return (
    <View className={classNames('sp-input', props.className)}>
      <Input
        value={props.value}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        cursor={cursor}
        onInput={handleInput}
      ></Input>
      {props.value && props.clear && <View className='sp-input__clear' onClick={handleClear}>x</View>}
    </View>
  )
}

SpInput.options = {
  addGlobalClass: true
}

SpInput.defaultProps = {
  className: '',
  value: '',
  clear:false,
  placeholder: '',
  maxLength: null,
  onChange: () => {}
}

export default SpInput
