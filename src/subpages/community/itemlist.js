import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpCheckbox, SpScrollView } from '@/components'
import { AtButton } from 'taro-ui'
import { updateSelectGoods } from '@/store/slices/select'
import CompGoodsItem from './comps/comp-goodsitem'
import './itemlist.scss'

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

function ItemList(props) {
  const [state, setState] = useImmer(initialState)
  const { selectGoods } = useSelector((state) => state.select)
  const { list, selection } = state
  const dispatch = useDispatch()
  const goodsRef = useRef()

  useEffect(() => {
    setState((draft) => {
      draft.selection = selectGoods
    })
  }, [])

  const onSelectGoodsChange = ({ id }, checked) => {
    // const temp = [...selection]
    const temps = new Set(selection)
    if (temps.has(id)) {
      temps.delete(id)
    } else {
      temps.add(id)
    }

    setState((draft) => {
      draft.selection = Array.from(temps)
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    setState((draft) => {
      draft.list = DEMO_DATA.map((item) => {
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
    dispatch(updateSelectGoods(selection))
    Taro.navigateBack()
  }

  return (
    <SpPage
      className='page-community-itemlist'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleConfirm}>
            确定
          </AtButton>
        </View>
      }
    >
      <SpScrollView className='itemlist-scroll' ref={goodsRef} fetch={fetch}>
        {list.map((item, index) => (
          <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
            <SpCheckbox
              checked={selection.includes(item.id)}
              onChange={onSelectGoodsChange.bind(this, item)}
            >
              <CompGoodsItem />
            </SpCheckbox>
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

ItemList.options = {
  addGlobalClass: true
}

export default ItemList
