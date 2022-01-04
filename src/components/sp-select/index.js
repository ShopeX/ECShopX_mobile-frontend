import React from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

function SpSelect (props) {
  const { info = [], value = [], multiple = false, onChange = () => {} } = props

  // useEffect( () => {

  // }, [])

  const selectedSet = new Set(value)
  console.log('xxx', selectedSet)
  const handleClick = ({ id }) => {
    if (!selectedSet.has(id)) {
      if (!multiple) {
        selectedSet.clear()
      }
      selectedSet.add(id)
    } else {
      selectedSet.delete(id)
    }

    onChange([...selectedSet])
  }

  return (
    <View className='sp-select'>
      {info.map((item) => (
        <View
          className={classNames('select-item', {
            active: value.includes(item.id)
          })}
          key={`select-item__${item.id}`}
          onClick={handleClick.bind(this, item)}
        >
          {item.name}
        </View>
      ))}
    </View>
  )
}

SpSelect.options = {
  addGlobalClass: true
}

export default React.memo(SpSelect)
