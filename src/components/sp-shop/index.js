import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { Text, View, ScrollView } from '@tarojs/components'
import { SpImage, SpGoodsItemType, SpLogin } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import S from '@/spx'
import doc from '@/doc'
import './index.scss'

const initialState = {
  isFav: false,
  items: [],
  loading: true
}
function SpShop(props) {
  const { info, style, isActive, goods_id, id = 0, } = props
  const [state, setState] = useImmer(initialState)
  const { isFav, items, loading } = state
  // tip: 平台自营info为空数组
  const { distributor_id } = info
  useEffect(() => {
    if (S.getAuthToken() && isActive) {
      fetch()
    }
  }, [isActive])

  useEffect(() => {
    if (distributor_id && isActive) {
      getItems()
    }
  }, [distributor_id, isActive])

  const fetch = async () => {
    const { is_fav } = await api.member.storeIsFav(distributor_id)
    if (is_fav) {
      setState((draft) => {
        draft.isFav = true
      })
    }
  }

  const getItems = async () => {
    if (goods_id) {
      try {
        const res = await api.wgts.getRelatedGoods(goods_id, 5)
        setState((draft) => {
          draft.items = pickBy(res, doc.wgt.WGTGOODSITEM_HERO)
          draft.loading = false
        })
      } catch (error) {
        setState((draft) => {
          draft.loading = false
        })
      }
    } else {
      try {
        const res = await api.wgts.getShelvesGoods({
          data_type: 'distributor',
          data_value: distributor_id,
        })
        setState((draft) => {
          draft.items = pickBy(res, doc.wgt.WGTGOODSITEM)
          draft.loading = false
        })
      } catch (error) {
        setState((draft) => {
          draft.loading = false
        })
      }
    }
  }

  // 关注店铺
  const handleFavStore = async () => {
    const { status } = await api.distribution.merchantIsvaild({ distributor_id: distributor_id })
    if (status) {
      if (isFav) {
        //取消
        await api.member.storeFavDel(distributor_id)
      } else {
        //关注
      }
      const { is_fav } = await api.member.storeIsFav(distributor_id)
      setState((draft) => {
        draft.isFav = is_fav
      })
    } else {
      showToast('店铺已注销，去别的店铺看看吧')
    }
  }

  const handleToStore = async () => {
    // 判断当前店铺关联商户是否被禁用 isVaild：true有效
    const { status } = await api.distribution.merchantIsvaild({ distributor_id: distributor_id })
    if (status) {
      Taro.navigateTo({ url: `/subpages/store/index?id=${distributor_id}` })
    } else {
      showToast('店铺已注销，去别的店铺看看吧')
    }
  }
  return (
    <View className='sp-shop' style={style}>
      <View className='sp-shop__wrap'>
        <View className='sp-shop__bd'>
          <View className='sp-shop__info'>
            <View className='sp-shop__info-left' onClick={() => handleToStore('进入店铺', 1)}>
              <View className='sp-shop__img'>
                <SpImage width={108} height={108} src={info.logo} mode='cover' placeholderColor='#f2f3f5' />
              </View>
              <View className='sp-shop__name'>{info.name}</View>
            </View>
            <View className='sp-shop__info-right'>
              <SpLogin onChange={() => {
                handleFavStore()
              }}>
                <View className='sp-shop__like'>
                  <SpImage
                    src={isFav ? 'fv_star_fav.png' : 'fv_star_outline.png'}
                    width={isFav ? 56 : 40}
                    height={isFav ? 56 : 40}
                  />
                </View>
              </SpLogin>
              <View className='sp-shop__link' onClick={() => handleToStore('进店逛逛', 3)}>
                <Text>进店逛逛</Text>
              </View>
            </View>
          </View>
        </View>
        {/* {loading && ( */}
        <View className='sp-goods-item-type' id={`sp-goods-item-type-${id}-${distributor_id}`}>
          <ScrollView scrollX className='sp-goods-item-type__item-list' enableFlex>
            {[1, 2, 3, 4].map((i) => (
              <View className='cp-skeleton' key={`goods-skeleton-${i}`}>
                <View className='cp-skeleton__image-container cp-skeleton__block' />
                <View className='cp-skeleton__content'>
                  <View className='cp-skeleton__title-container'>
                    <View className='cp-skeleton__line' style={{ width: '80%' }} />
                  </View>
                  <View className='cp-skeleton__tag-container'>
                    <View className='cp-skeleton__line' style={{ width: '30%' }} />
                    <View className='cp-skeleton__line' style={{ width: '30%' }} />
                  </View>
                  <View className='cp-skeleton__price-wrapper'>
                    <View className='cp-skeleton__line' style={{ width: '80%' }} />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* )} */}
        {/* {items.length > 0 && !loading && (
          <SpGoodsItemType list={items}  index={id} did={distributor_id} />
        )} */}
      </View>
    </View>
  )
}

SpShop.options = {
  addGlobalClass: true
}

export default SpShop
