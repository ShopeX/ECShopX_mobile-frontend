/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, Picker } from '@tarojs/components'
import { useTranslation, $t, i18n } from '@/i18n'
import './index.scss'

/**
 * 该组件接受自定义名字和下拉框内容自定义，默认全部定铺
 * customStatus：是否自定义
 * customName：自定义的名字
 * 用法：<CustomPicker customStatus customName={customName} cancel={cancel} />
 *
 */

function CustomPicker(props) {
  useTranslation()
  const { selector: selectorIn = [], customStatus = false, cancel = () => {}, id = '' } = props
  const selector =
    selectorIn.length > 0 ? selectorIn : [{ label: $t('4daf1c1e.8098e2'), value: 'phone' }]

  const [state, setState] = useImmer({
    selectorChecked: selector[0].label,
    value: '0',
    customName: ''
  })
  const { selectorChecked, value, customName } = state

  useEffect(() => {
    const onLang = () => {
      if (selectorIn.length === 0) {
        setState((draft) => {
          draft.selectorChecked = $t('4daf1c1e.8098e2')
        })
      }
    }
    i18n.on('languageChanged', onLang)
    return () => i18n.off('languageChanged', onLang)
  }, [selectorIn.length, setState])

  useEffect(() => {
    if (customStatus) {
      selector.map((item, index) => {
        if (id == item.value) {
          setState((draft) => {
            draft.value = String(index)
            draft.customName = item.label
          })
        }
      })
      console.log('customStatus1', id, selector)
    }
  }, [id, selector])

  const onChange = (e) => {
    console.log('e', e)
    let index = Number(e.detail.value)
    setState((draft) => {
      draft.selectorChecked = selector[index].label
    })
    cancel(index, selector[index])
  }

  return (
    <View className='custom-picker'>
      <Picker mode='selector' rangeKey='label' range={selector} onChange={onChange} value={value}>
        <View className='picker-box'>
          <Text>{customStatus ? customName : selectorChecked}</Text>
          <Text className='iconfont icon-xialajiantou'></Text>
        </View>
      </Picker>
    </View>
  )
}

CustomPicker.options = {
  addGlobalClass: true
}

CustomPicker.defaultProps = {
  selector: []
}

export default CustomPicker
