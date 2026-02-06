import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { Text, View, ScrollView } from '@tarojs/components'
import SpTag from '@/components/sp-tag/index'
import { SpImage, SpLogin, SpPrice } from '@/components'
import api from '@/api'
import { pickBy, showToast, navigateToStoreByDistributorId, classNames } from '@/utils'
import S from '@/spx'
import doc from '@/doc'
import './index.scss'

const initialState = {
  isFav: false,
  items: [],
  loading: true
}
function SpShop(props) {
  const { info, style, isActive, id = 0 } = props
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
    try {
      const res = await api.seckill.getWidgetItems({
        data_type: 'distributor',
        data_value: distributor_id
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
      await navigateToStoreByDistributorId(distributor_id)
    } else {
      showToast('店铺已注销，去别的店铺看看吧')
    }
  }
  const handleClickItem = (item) => {
    Taro.navigateTo({
      url: `/pages/item/espier-detail?id=${item.itemId}&dtid=${distributor_id}`
    })
  }
  return (
    <View className='sp-shop' style={style}>
      <View className='sp-shop__wrap'>
        <View className='sp-shop__bd'>
          <View className='sp-shop__info'>
            <View className='sp-shop__info-left' onClick={() => handleToStore('进入店铺', 1)}>
              <View className='sp-shop__img'>
                <SpImage
                  width={108}
                  height={108}
                  src={info.logo}
                  mode='cover'
                  placeholderColor='#f2f3f5'
                />
              </View>
              <View className='sp-shop__name'>{info.name}</View>
            </View>
            <View className='sp-shop__info-right'>
              <SpLogin
                onChange={() => {
                  handleFavStore()
                }}
              >
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
        {loading && (
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
        )}
        {items.length > 0 && !loading && (
          <ScrollView scrollX className='sp-shop__goods-list' enableFlex>
            {items.map((item) => (
              <View className='sp-shop__goods-item' onClick={() => handleClickItem(item)}>
                <View className='sp-shop__goods-item-image'>
                  <SpImage src={item.pic} placeholderColor='#f2f3f5' mode='aspectFill' />
                  {item.store === 0 && (
                    <View className='sp-shop__goods-item-sold-out'>
                      <View className='sp-shop__goods-item-sold-out-text'>
                        <Text>已售罄</Text>
                      </View>
                    </View>
                  )}
                </View>

                <View className='sp-shop__goods-item-content'>
                  <View className='sp-shop__goods-item-title-container'>
                    <View className='sp-shop__goods-item-title-wrapper'>
                      {item.promotionSkill && (
                        <View className='sp-shop__goods-item-title-wrapper-img'>
                          <SpImage
                            src='fv_activity_seckill.png'
                            mode='heightFix'
                            width={62}
                            height={31}
                          />
                        </View>
                      )}
                      {item.memberPreference?.marketing_name && (
                        <View className='sp-shop__goods-item-title-wrapper-img'>
                          <SpImage
                            src='fv_member_preference.png'
                            mode='heightFix'
                            width={62}
                            height={31}
                          />
                        </View>
                      )}
                      <Text
                        className={classNames(
                          item.tags?.length > 0 ||
                            item.discount_rate ||
                            item?.couponList?.length > 0
                            ? 'sp-shop__goods-item-title'
                            : 'sp-shop__goods-item-title-two',
                          {
                            'sp-shop__goods-item-title-skill': item.promotionSkill
                          }
                        )}
                      >
                        {item.itemName || item.title}
                      </Text>
                    </View>
                  </View>

                  {((item.tags && item.tags.length > 0) ||
                    (item?.couponList && item?.couponList?.length > 0) ||
                    item.discount_rate) && (
                    <View className='sp-shop__goods-item-tags'>
                      {item.discount_rate && (
                        <SpTag label={`${item.discount_rate}折`} type='secondary' />
                      )}
                      {item.tags.slice(0, 3)?.map((tag, index) => (
                        <SpTag
                          key={index}
                          label={tag.tag_name}
                          type={tag.type || 'primary'}
                          className='item-three__tag'
                        />
                      ))}
                      {item.couponList?.map((coupon, index) => (
                        <SpTag
                          key={index}
                          label={coupon.discount_rule}
                          type='warning'
                          className='sp-shop__goods-item-tag'
                        />
                      ))}
                    </View>
                  )}
                  <View className='sp-shop__goods-item-price-container'>
                    <View className='sp-shop__goods-item-price-wrapper'>
                      <SpPrice
                        value={item?.mainPrice}
                        primary
                        color='#1A1A1A'
                        size={30}
                        weight={600}
                      />
                      {Number(item?.originalPrice || 0) / 100 > Number(item?.mainPrice || 0) && (
                        <View className='sp-shop__goods-item-original-price-wrapper ml-8'>
                          <SpPrice
                            value={item?.originalPrice}
                            noSymbol
                            unit='cent'
                            lineThrough
                            size={22}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  )
}

SpShop.options = {
  addGlobalClass: true
}

export default SpShop
