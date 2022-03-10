import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage } from '@/components'
import api from '@/api'
import { isArray, classNames } from '@/utils'
import './comp-store.scss'

const initialState = {
  isFav: false
}
function CompStore(props) {
  const { info } = props
  const [state, setState] = useImmer(initialState)
  const { isFav } = state
  // tip: 平台自营info为空数组
  if (!info || isArray(info)) {
    return null
  }

  const fetch = async () => {
    const { distributorId } = info
    const { is_fav } = await api.member.storeIsFav(distributorId)
    if (is_fav) {
      setState((draft) => {
        draft.isFav = true
      })
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  // 关注店铺
  const handleFavStore = async () => {
    const { distributorId } = info
    const { status } = await api.distribution.merchantIsvaild({ distributor_id: distributorId })
    if (status) {
      if (!isFav) {
        const { fav_id } = await api.member.storeFav(distributorId)
        if (fav_id) {
          setState((draft) => {
            draft.isFav = true
          })
        }
      }
    } else {
      showToast('店铺已注销，去别的店铺看看吧')
    }
  }

  const handleToStore = async () => {
    const { distributorId } = info
    // 判断当前店铺关联商户是否被禁用 isVaild：true有效
    const { status } = await api.distribution.merchantIsvaild({ distributor_id: distributorId })
    if (status) {
      Taro.navigateTo({ url: `/pages/store/index?id=${distributorId}` })
    } else {
      showToast('店铺已注销，去别的店铺看看吧')
    }
  }

  return (
    <View className='comp-store'>
      <View className='store-bd'>
        <View className='store-icon'>
          <SpImage src={info.logo} width={120} height={120} />
        </View>
        <View className='store-info'>
          <View className='store-name'>{info.storeName}</View>
          <View className='store-rate'></View>
        </View>
      </View>
      <View className='store-ft'>
        <View className='btn-wrap'>
          <AtButton
            circle
            onClick={handleFavStore}
            className={classNames({
              'at-button--default': isFav
            })}
          >{`${isFav ? '已关注' : '关注店铺'}`}</AtButton>
        </View>
        <View className='btn-wrap'>
          <AtButton circle onClick={handleToStore}>
            进店逛逛
          </AtButton>
        </View>
      </View>
    </View>
  )
}

CompStore.options = {
  addGlobalClass: true
}

export default CompStore
