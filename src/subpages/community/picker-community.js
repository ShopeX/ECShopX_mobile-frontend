import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpScrollView, SpCheckbox } from '@/components'
import { AtButton } from 'taro-ui'
import './picker-community.scss'

const DEMO_DATA = [
  { id: 1, name: 'xx' },
  { id: 2, name: 'xx' },
  { id: 3, name: 'xx' },
  { id: 4, name: 'xx' },
  { id: 5, name: 'xx' },
  { id: 6, name: 'xx' },
  { id: 7, name: 'xx' },
  { id: 8, name: 'xx' }
]

const initialState = {
  selection: [],
  list: []
}
function PickerCommunity(props) {
  const [ state, setState ] = useImmer(initialState)
  const { selectGoods } = useSelector((state) => state.select)
  const { list, selection } = state
  const dispatch = useDispatch()
  const goodsRef = useRef()

  useEffect(() => {
    setState(draft => {
      draft.selection = selectGoods
    })
  }, [])

  const onSelectCommunityChange = ({ id }, checked) => {
    // const temp = [...selection]
    const temps = new Set(selection)
    if(temps.has(id)) {
      temps.delete(id)
    } else {
      temps.add(id)
    }

    setState(draft => {
      draft.selection = Array.from(temps)
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    setState(draft => {
      draft.list = DEMO_DATA.map(item => {
        return {
          ...item,
          checked: selectGoods.includes(item.id)
        }
      })
    })
    return {
      total: 5
    }
  }

  const handleConfirm = () => {
    Taro.navigateTo({
      url: `/subpages/community/community-edit?type=add`
    })
  }

  return (
    <SpPage
      className='page-community-picker'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleConfirm}>
            添加自提点
          </AtButton>
        </View>
      }
    >
      <SpScrollView className='itemlist-scroll' ref={goodsRef} fetch={fetch}>
        {[1,2,3,4,5].map((item, index) => (
          <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
            <SpCheckbox
              checked={selection.includes(item.id)}
              onChange={onSelectCommunityChange.bind(this, item)}
            >
              <View className="community-item">
                <View className="community-location">上海市上海普陀区</View>
                <View className="community-address">XXXXXXXXXXXXXXX小区</View>
              </View>
            </SpCheckbox>
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

PickerCommunity.options = {
  addGlobalClass: true
}

export default PickerCommunity
