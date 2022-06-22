import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames, isNumber } from '@/utils'
import './index.scss'


const ret = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
const initialState = {
  currentValue: 0
}

function SpNumberKeyBoard(props) {
  const { 
    maxValue = 0,
    value = 0, onClose = () => {}, onConfirm = () => {} } = props
  const [state, setState] = useImmer(initialState)
  const { currentValue } = state

  const handleClickItem = (key) => {
    let _currentValue = currentValue
    if (isNumber(key)) {
      _currentValue = `${_currentValue == '0' ? '' : _currentValue}${key}`
    }


    if (
      !/\./.test(_currentValue) || // 首位不含.
      (!/^\./.test(_currentValue) && //
        !/\.\d{3}/.test(_currentValue) &&
        _currentValue.match(/\./g).length <= 1)
    ) {
      setState((draft) => {
        draft.currentValue = _currentValue
      })
    }

    switch (key) {
      case 'close':
        onClose()
        break
      case 'clear':
        setState((draft) => {
          draft.currentValue = '0'
        })
        break
      case 'ok':
        if(!isDisabled()) {
          onConfirm(_currentValue)
        }
        break
      case 'all':
        setState((draft) => {
          draft.currentValue = maxValue < value ? maxValue : value
        })
        break
      default:
        break
    }
  }

  const isDisabled = () => {
    // console.log(ret.test(currentValue), parseFloat(currentValue) <= maxValue)
    return !(currentValue == '0' || (ret.test(currentValue) && parseFloat(currentValue) <= maxValue))
  }

  return (
    <View className='sp-number-keyboard'>
      <View className='display-col'>
        <View className='title'>
          {/* 可用余额: <SwPrice value={maxValue}></SwPrice>
          <Text className='all-use' onClick={handleClickUseAll.bind(this)}>
            全部使用
          </Text> */}
        </View>
        <View className='display-con'>{currentValue}</View>
      </View>
      <View className='row-root row'>
        <View className='col'>
          <View className='row'>
            <View className='keyboard' onClick={handleClickItem.bind(this, 1)}>
              1
            </View>
            <View className='keyboard' onClick={handleClickItem.bind(this, 2)}>
              2
            </View>
            <View className='keyboard' onClick={handleClickItem.bind(this, 3)}>
              3
            </View>
          </View>
          <View className='row'>
            <View className='keyboard' onClick={handleClickItem.bind(this, 4)}>
              4
            </View>
            <View className='keyboard' onClick={handleClickItem.bind(this, 5)}>
              5
            </View>
            <View className='keyboard' onClick={handleClickItem.bind(this, 6)}>
              6
            </View>
          </View>
        </View>
        <View className='col'>
          <View className='keyboard word' onClick={handleClickItem.bind(this, 'clear')}>
            清除
          </View>
        </View>
      </View>
      <View className='row-root'>
        <View className='col'>
          <View className='row'>
            <View className='keyboard' onClick={handleClickItem.bind(this, 7)}>
              7
            </View>
            <View className='keyboard' onClick={handleClickItem.bind(this, 8)}>
              8
            </View>
            <View className='keyboard' onClick={handleClickItem.bind(this, 9)}>
              9
            </View>
          </View>
          <View className='row'>
            <View className='keyboard word' onClick={handleClickItem.bind(this, 'all')}>
              全部使用
            </View>
            <View className='keyboard' onClick={handleClickItem.bind(this, 0)}>
              0
            </View>
            <View className='keyboard word' onClick={handleClickItem.bind(this, 'close')}>
              关闭
            </View>
          </View>
        </View>
        <View
          className={classNames(`col btn-ok__con`, {
            disabled: isDisabled()
          })}
        >
          <View className='keyboard word' onClick={handleClickItem.bind(this, 'ok')}>
            确定
          </View>
        </View>
      </View>
    </View>
  )
}

SpNumberKeyBoard.options = {
  addGlobalClass: true
}

export default SpNumberKeyBoard
