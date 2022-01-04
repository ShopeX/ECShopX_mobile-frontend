import Taro, { useCallback, memo, useState, useMemo } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpNewDrawer } from '@/components'
import CustomButton from './comps/button'
import './index.scss'

const JSONSTR = (obj) => JSON.parse(JSON.stringify(obj))

const SpNewFilterDrawer = (props) => {
  const { visible = false, filterData = [], onCloseDrawer = () => {} } = props

  const filterObject = useMemo(() => {
    const keysObject = filterData
      .map((item) => item.value)
      .reduce((total, current) => {
        total[current] = []
        return total
      }, {})
    return keysObject
  }, [filterData.length])

  const [selectedValue, setSelectedValue] = useState(JSONSTR(filterObject))

  const handleClickLabel = (item, key) => {
    let selected = selectedValue[key]
    let selectedIndex = selected.indexOf(item.value)
    if (selectedIndex > -1) {
      selected.splice(selectedIndex, 1)
    } else {
      selected.push(item.value)
    }
    setSelectedValue(
      JSONSTR({
        ...selectedValue,
        [key]: [...selected]
      })
    )
  }

  const handleConfirm = useCallback(() => {
    onCloseDrawer(selectedValue)
  }, [onCloseDrawer, selectedValue])

  const handleReset = useCallback(() => {
    setSelectedValue(JSONSTR(filterObject))
    onCloseDrawer(filterObject)
  }, [onCloseDrawer, filterObject])

  return (
    <SpNewDrawer visible={visible} onClose={onCloseDrawer}>
      <View className={classNames('sp-new-filter-drawer')}>
        <ScrollView className='sp-new-filter-drawer-container'>
          {filterData.map((item) => {
            return (
              <View className='sp-new-filter-drawer-container-block'>
                <View className='title'>{item.label}</View>
                {item.children.map((citem, index) => (
                  <View
                    className={classNames('sp-filter-block', {
                      'checked': selectedValue[item.value].includes(citem.value)
                    })}
                    onClick={() => handleClickLabel(citem, item.value)}
                  >
                    {citem.label}
                  </View>
                ))}
              </View>
            )
          })}
        </ScrollView>
        <View className='sp-new-filter-drawer-action'>
          <CustomButton onConfirm={handleConfirm} onReset={handleReset} />
        </View>
      </View>
    </SpNewDrawer>
  )
}

SpNewFilterDrawer.options = {
  addGlobalClass: true
}

export default memo(SpNewFilterDrawer)
