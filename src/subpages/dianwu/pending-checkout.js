/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import * as dianwuApi from '@/api/dianwu'
import doc from '@/subpages/doc'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SG_DIANWU_TOKEN } from '@/consts'
import { SpPage, SpScrollView, SpImage, SpPrice } from '@/components'
import { selectMember } from '@/store/slices/dianwu'
import { useTranslation, $t, ti, i18n } from '@/i18n'
import { useNavigation } from '@/hooks'
import { classNames, pickBy, emitOpenerEvent } from '@/utils'
import CompGoods from './comps/comp-goods'
import CompGift from './comps/comp-gift'
import CompTabbar from './comps/comp-tabbar'
import './pending-checkout.scss'

const initialState = {
  list: [
    // {
    //   name: 1,
    //   showDetail: false,
    //   items: [
    //     { name: 'xxx1' },
    //     { name: 'xxx2' },
    //     { name: 'xxx3' },
    //     { name: 'xxx4' },
    //     { name: 'xxx1' },
    //     { name: 'xxx2' },
    //     { name: 'xxx3' },
    //     { name: 'xxx4' }
    //   ]
    // },
    // { name: 2, showDetail: false, items: [{ name: 'xxx1' }] },
    // { name: 3, showDetail: false, items: [{ name: 'xxx1' }] },
    // { name: 4, showDetail: false, items: [{ name: 'xxx1' }] }
  ]
}
function DianwuPendingCheckout(props) {
  useTranslation()
  const $instance = getCurrentInstance() || {}
  const { distributor_id, from } = $instance?.router?.params
  const [state, setState] = useImmer(initialState)
  const { list } = state
  const { member } = useSelector((state) => state.dianwu)
  const dispatch = useDispatch()
  const listRef = useRef()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('b955adbf.b10acb'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle])

  // useDianWuLogin()

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      distributor_id,
      user_id: member?.userId
    }
    const { list: _list, total_count } = await dianwuApi.penddingList(params)
    console.log('PENDING_ITEM:', pickBy(_list, doc.dianwu.PENDING_ITEM))
    setState((draft) => {
      draft.list[pageIndex - 1] = pickBy(_list, doc.dianwu.PENDING_ITEM)
    })

    return {
      total: total_count
    }
  }

  const toggleShowDetail = ({ showDetail }, index, sidx) => {
    setState((draft) => {
      draft.list[index][sidx].showDetail = !showDetail
    })
  }

  const handleDeleteItem = async ({ pendingId }) => {
    const { confirm } = await Taro.showModal({
      title: $t('61e2d21a.02d981'),
      content: $t('47860443.64d782'),
      showCancel: true,
      cancelText: $t('61e2d21a.625fb2'),
      confirmText: $t('61e2d21a.e83a25')
    })
    if (!confirm) return
    await dianwuApi.penddingDelete({ pending_id: pendingId })
    listRef.current.reset()
  }

  const handleFetchOrder = async ({ pendingId, userId }) => {
    const token = Taro.getStorageSync(SG_DIANWU_TOKEN)
    await dianwuApi.fetchPendding({
      pending_id: pendingId,
      user_id: member?.userId,
      distributor_id
    })
    if (userId != 0) {
      const userInfo = await dianwuApi.getMemberByUserId({ user_id: userId })
      const _userInfo = pickBy(userInfo, doc.dianwu.MEMBER_INFO)
      dispatch(selectMember(_userInfo))
    }
    if (from == 'home' || from == 'tabbar' || from == 'checkout') {
      Taro.redirectTo({
        url: `/subpages/dianwu/cashier?token=${token}&distributor_id=${distributor_id}`
      })
      return
    }
    emitOpenerEvent('onEventFetchOrder')
    Taro.navigateBack()
  }

  return (
    <SpPage
      className='page-dianwu-pending-checkout'
      footerHeight={96}
      renderFooter={<CompTabbar />}
    >
      <SpScrollView className='pending-checkout-list' ref={listRef} fetch={fetch}>
        {list.map((items, index) => {
          return items.map((item, sidx) => (
            <View className='pending-checkout-item' key={`pending-checkout-item__${index}_${sidx}`}>
              <View className='checkoutitem-hd'>
                <View className='create-time'>{item.created}</View>
              </View>
              <View className='checkoutitem-bd'>
                <View className='user-info'>
                  <SpImage
                    src={item?.memberInfo?.avatar || 'user_icon.png'}
                    width={70}
                    height={70}
                    circle
                  />
                  <View className='user-wrap'>
                    <View>
                      <Text className='name'>
                        {item?.memberInfo?.username || $t('2b4b2b4f.1a75c1')}
                      </Text>
                      <Text className='mobile'>{item?.memberInfo?.mobile}</Text>
                    </View>
                    {/* <View className='vip'>白金会员</View> */}
                  </View>
                </View>
                {!item.showDetail && (
                  <View className='shousuo-detail'>
                    <View className='goods-list'>
                      <ScrollView className='goods-image-wrap' scrollX>
                        {item.pendingData.map((goods, goods_index) => (
                          <SpImage
                            src={goods.pic}
                            width={110}
                            height={110}
                            circle={8}
                            key={`goods-image__${goods_index}`}
                          />
                        ))}
                      </ScrollView>
                      <View className='total-num'>{ti('47860443.59594a', [item.totalNum])}</View>
                    </View>
                    {/* <View className='gift-list'>
                    <View className='gift-tag'>赠品</View>
                    <View className='gift-name'>
                      我商品名我商品名我商品名最多只显示一行我商品名我商品名我商品名最多只显示一行
                    </View>
                    <View className='gift-more'>共9件赠品</View>
                  </View> */}
                  </View>
                )}

                {item.showDetail && (
                  <View className='expend-detail'>
                    <View className='goods-list'>
                      {item.pendingData.map((goods, goods_index) => (
                        <View className='g-item' key={`g-item__${index}_${goods_index}`}>
                          <View className='g-item-hd'>
                            <SpImage src={goods.pic} width={110} height={110} />
                          </View>
                          <View className='g-item-bd'>
                            <View className='title'>
                              {goods.isPrescription == 1 && goods.isMedicine == 1 && (
                                <Text className='prescription-drug'>{$t('7d82f6d2.e8b7e1')}</Text>
                              )}
                              {goods.name}
                            </View>
                            <View className='sku-num'>
                              <View className='sku-num-l'>
                                {goods.itemSpecDesc && (
                                  <View className='sku'>{goods.itemSpecDesc}</View>
                                )}
                                <SpPrice value={goods.price} />
                              </View>
                              <View className='g-num'>{ti('47860443.bf39fe', [goods.num])}</View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                    {/* <View className='gift-list'>
                      {[1, 2, 3].map((item, index) => (
                        <CompGift />
                      ))}
                    </View> */}
                  </View>
                )}
              </View>
              <View className='checkoutitem-ft'>
                <View
                  className={classNames('btn-showdetial', {
                    'expended': item.showDetail
                  })}
                  onClick={toggleShowDetail.bind(this, item, index, sidx)}
                >
                  {item.showDetail ? $t('47860443.56adcf') : $t('47860443.28d467')}
                  <Text className='iconfont icon-qianwang-01'></Text>
                </View>
                <View className='btn-actions'>
                  <AtButton circle onClick={handleDeleteItem.bind(this, item)}>
                    {$t('47860443.2f4aad')}
                  </AtButton>
                  <AtButton
                    circle
                    className='active-checkout'
                    onClick={handleFetchOrder.bind(this, item)}
                  >
                    {$t('47860443.b10acb')}
                  </AtButton>
                </View>
              </View>
            </View>
          ))
        })}
      </SpScrollView>
    </SpPage>
  )
}

DianwuPendingCheckout.options = {
  addGlobalClass: true
}

export default DianwuPendingCheckout
