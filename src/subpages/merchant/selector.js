import Taro, { useRouter } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useRef } from 'react'
import { MNavBar, MCell } from './comps'
import { SpSearchBar, SpPage, SpScrollView, SpImage } from '@/components'
import api from '@/api'
import { useSelector, useDispatch } from 'react-redux'
import { updateMerchantType, updateBusinessScope, updateBank } from '@/store/slices/merchant'
import { MERCHANT_TYPE, BANG_NAME, PLACEHOLDER_SELECTOR, BUSINESS_SCOPE } from './consts'
import { useImmer } from 'use-immer'
import { setMerchant, splitMatch } from './util'
import { classNames } from '@/utils'
import './selector.scss'

const initialState = {
  list: [],
  name: '',
  //表示正在搜索的词
  searchingName: ''
}

const Selector = () => {
  const [state, setState] = useImmer(initialState)
  const dispatch = useDispatch()
  const selectsRef = useRef()
  const {
    params: { type, parent_id }
  } = useRouter()
  const isBank = type === BANG_NAME
  const fetch = async ({ pageIndex: page, pageSize }) => {
    let params = {
      page,
      page_size: pageSize,
      parent_id: type === MERCHANT_TYPE ? 0 : parent_id
    }
    if (isBank) {
      params.bank_name = name
    } else {
      params.name = name
    }
    let list = [],
      total_count = 0
    if (isBank) {
      const res = await api.merchant.bank_list(params)
      list = res.list
      total_count = res.total_count
    } else {
      const res = await api.merchant.type_list(params)
      list = res.list
      total_count = res.total_count
    }

    await setState((v) => {
      v.list = [...v.list, ...list]
    })

    return {
      total: total_count
    }
  }

  //点击搜索框搜索
  const handleConfirm = async (val) => {
    await setState((v) => {
      v.list = []
      v.name = val
      v.searchingName = val
    })
    selectsRef.current.reset()
  }

  const handleClick = ({ id, name, parent_id, bank_name }) => {
    if (type === MERCHANT_TYPE) {
      dispatch(
        updateMerchantType({
          id,
          name,
          parent_id
        })
      )
    } else if (type === BUSINESS_SCOPE) {
      dispatch(
        updateBusinessScope({
          id,
          name,
          parent_id
        })
      )
    } else if (type === BANG_NAME) {
      dispatch(
        updateBank({
          name: bank_name
        })
      )
    }
    Taro.navigateBack()
  }

  const handleSearchOff = () => {
    setState((v) => {
      v.name = ''
    })
  }

  const handleOnClear = async () => {
    await setState((v) => {
      v.name = ''
      v.list = []
      v.searchingName = ''
    })
    selectsRef.current.reset()
  }

  const handleOnChange = async (val) => {
    await setState((v) => {
      v.name = val
    })
  }

  const handleBlur = () => {
    setState((v) => {
      v.name = ''
    })
  }

  const renderEmpty = (
    <View className='render-empty'>
      <SpImage src='empty_goods.png' />
      <View className='title'>暂无可选项～</View>
    </View>
  )
  const { list, name, searchingName } = state

  const renderTitle = (item) => {
    const title = isBank ? item.bank_name : item.name

    if (!searchingName) return title

    const matches = splitMatch(title, searchingName)

    return (
      <View className='flex'>
        {matches.map((item) => (
          <Text className={classNames({ 'primary-color': item.checked })}>{item.label}</Text>
        ))}
      </View>
    )
  }

  return (
    <SpPage className='page-merchant-selector' navbar={false}>
      <MNavBar canLogout={false} />

      <View className='page-merchant-selector-inputwrapper'>
        <SpSearchBar
          keyword={name}
          className='sp-page-selector-input'
          placeholder={PLACEHOLDER_SELECTOR[type]}
          onConfirm={handleConfirm}
          onCancel={handleSearchOff}
          onClear={handleOnClear}
          onChange={handleOnChange}
          onBlur={handleBlur}
        />
      </View>

      <SpScrollView
        scrollY
        fetch={fetch}
        className='selector-scroll'
        ref={selectsRef}
        renderEmpty={renderEmpty}
      >
        <View className='page-merchant-selector-content'>
          <View className='card'>
            {list.map((item, index) => (
              <MCell
                key={index}
                title={renderTitle(item)}
                noselect
                onClick={() => handleClick(item)}
              />
            ))}
          </View>
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default Selector
