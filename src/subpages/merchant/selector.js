import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import { useState } from 'react'
import { MNavBar, MCell } from './comps'
import { updateState } from '@/store/slices/merchant'
import { SpSearchBar, SpPage } from '@/components'
import api from '@/api'
import { usePage, useDepChange } from '@/hooks'
import { useSelector, useDispatch } from 'react-redux'
import { MERCHANT_TYPE, BUSINESS_SCOPE } from './consts'
import { setMerchant } from './util'
import './selector.scss'

const Selector = () => {
  const [dataList, setDataList] = useState([])

  const dispatch = useDispatch()

  const {
    params: { type, parent_id }
  } = useRouter()

  const [name, setName] = useState('')

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      page_size: pageSize,
      parent_id: type === MERCHANT_TYPE ? 0 : parent_id,
      name
    }
    const { list, total_count } = await api.merchant.typeList(params)

    setDataList([...dataList, ...list])

    return {
      total: total_count
    }
  }

  const { resetPage } = usePage({
    fetch
  })

  const handleBack = () => {
    Taro.navigateBack()
  }

  //点击搜索框搜索
  const handleConfirm = (item) => {
    setName(item)
  }

  useDepChange(() => {
    resetPage()
    setDataList([])
  }, [name])

  const handleClick = ({ id, name, parent_id }) => {
    setMerchant({ key: type, id, name, parent_id })
    Taro.navigateBack()
  }

  return (
    <SpPage className='page-merchant-selector' needNavbar={false}>
      <MNavBar canLogout={false} onBack={handleBack} />

      <View className='page-merchant-selector-inputwrapper'>
        <SpSearchBar
          className='sp-page-selector-input'
          placeholder='请输入商家类型'
          onConfirm={handleConfirm}
        />
      </View>

      <ScrollView scrollY className='selector-scroll'>
        <View className='page-merchant-selector-content'>
          <View className='card'>
            {dataList.map((item, index) => (
              <MCell key={index} title={item.name} noselect onClick={() => handleClick(item)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SpPage>
  )
}

export default Selector
