/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidHide } from '@tarojs/taro'
import api from '@/api'
import * as dianwuApi from '@/api/dianwu'
import doc from '@/subpages/doc'
import { View, Text, ScrollView, Camera } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtButton } from 'taro-ui'
import {
  SpPage,
  SpSearchInput,
  SpPrice,
  SpImage,
  SpVipLabel,
  SpInputNumber,
  SpFloatLayout,
  SpCell,
  SpNote,
  SpInput as AtInput
} from '@/components'
import { useDianWuLogin, useDebounce } from '@/hooks'
import { styleNames, pickBy, showToast, classNames, validate } from '@/utils'
import { useTranslation, $t, i18n, ti } from '@/i18n'
import { selectMember } from '@/store/slices/dianwu'
import CompGoods from './comps/comp-goods'
import CompGift from './comps/comp-gift'
import CompGoodsPrice from './comps/comp-goods-price'
import CompTabbar from './comps/comp-tabbar'
import CompDianwuSelectMember from './comps/comp-dianwu-select-member'
import CompDianwuPlatformOrder from './comps/comp-dianwu-platform-order'
import './cashier.scss'

const initialState = {
  keywords: '',
  cartList: [],
  searchGoodsList: [],
  discountDetailLayout: false,
  searchResultLayout: false,
  addUserCurtain: false,
  isCameraOpend: false,
  platformOrderItem: null
}

function DianWuCashier() {
  const [state, setState] = useImmer(initialState)
  const {
    keywords,
    cartList,
    discountDetailLayout,
    searchResultLayout,
    addUserCurtain,
    searchGoodsList,
    isCameraOpend,
    distributor_id,
    platformOrderItem
  } = state
  const pageRef = useRef()
  const getCashierListRef = useRef(null)
  const scanIsUseableRef = useRef(true)
  const audioContextRef = useRef()
  const $instance = getCurrentInstance() || {}

  const { member } = useSelector((state) => state.dianwu)
  const dispatch = useDispatch()

  useTranslation()

  useEffect(() => {
    const syncNavTitle = () => {
      Taro.setNavigationBarTitle({ title: $t('7187dbd0.5cbddd') })
    }
    syncNavTitle()
    i18n.on('languageChanged', syncNavTitle)
    return () => i18n.off('languageChanged', syncNavTitle)
  }, [])

  // useDianWuLogin()

  useEffect(() => {
    // audioContextRef.current = wx.createInnerAudioContext({
    //   useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    // })
    // audioContextRef.current.src = `${process.env.APP_IMAGE_CDN}/scan_success.wav`
    const { distributor_id: dtid } = $instance?.router?.params
    setState((draft) => {
      draft.distributor_id = dtid
    })
  }, [])

  useEffect(() => {
    const { distributor_id: dtid } = $instance?.router?.params
    getCashierList(dtid)
  }, [member])

  useEffect(() => {
    if (discountDetailLayout || searchResultLayout || addUserCurtain || platformOrderItem) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [discountDetailLayout, searchResultLayout, addUserCurtain, platformOrderItem])

  useEffect(() => {
    if (keywords) {
      handleSearchByKeyword(keywords)
    }
  }, [keywords])

  const handleSearchByKeyword = async (keywords) => {
    Taro.showLoading({ title: '' })
    const { list: goodsList } = await dianwuApi.goodsItems({
      page: 1,
      pageSize: 100,
      keywords,
      distributor_id
    })
    Taro.hideLoading()

    setState((draft) => {
      draft.searchGoodsList = pickBy(goodsList, doc.dianwu.GOODS_ITEM)
      // draft.searchMemberList = pickBy(memberList, doc.dianwu.MEMBER_ITEM)
      draft.searchResultLayout = true
    })
  }

  const handleScanGoodsBN = async () => {
    // 注意：真机scancode扫码完成后回调，taro getCurrentInstance()?.router = null，无法获取到路由参数
    const { errMsg, result } = await Taro.scanCode()
    console.log('handleScanCode:', result)
    if (errMsg == 'scanCode:ok') {
      Taro.showLoading({ title: '' })
      await dianwuApi.scanAddToCart({
        barcode: result,
        distributor_id
      })
      Taro.hideLoading()
      showToast($t('7187dbd0.edd566'))
      getCashierList()
    } else {
      showToast(errMsg)
    }
  }

  const getCashierList = async (dtid) => {
    const { valid_cart } = await dianwuApi.getCartDataList({
      user_id: member?.userId,
      distributor_id: dtid || distributor_id
    })
    setState((draft) => {
      draft.cartList = pickBy(valid_cart, doc.dianwu.CART_GOODS_ITEM)
    })
  }
  getCashierListRef.current = getCashierList

  const onChangeInputNumber = useDebounce(async ({ cartId, itemId }, num) => {
    await dianwuApi.updateCartData({
      cart_id: cartId,
      item_id: itemId,
      num,
      is_checked: true,
      distributor_id
    })
    getCashierList()
  }, 200)

  const handleDeleteCartItem = async ({ cartId }) => {
    const { confirm } = await Taro.showModal({
      title: $t('7187dbd0.02d981'),
      content: $t('7187dbd0.638dc7'),
      showCancel: true,
      cancel: $t('7187dbd0.625fb2'),
      cancelText: $t('7187dbd0.625fb2'),
      confirmText: $t('7187dbd0.e83a25')
    })
    if (!confirm) return
    await dianwuApi.deleteCartData(cartId)
    getCashierList()
  }

  const handleAddToCart = async ({ itemId }) => {
    await dianwuApi.addToCart({
      item_id: itemId,
      num: 1,
      distributor_id
    })
    getCashierList()
    showToast($t('7187dbd0.edd566'))
  }

  const handleScanCodeByGoods = async (e) => {
    console.log('handleScanCodeByGoods:', e, scanIsUseableRef.current)
    if (scanIsUseableRef.current) {
      scanIsUseableRef.current = false
      audioContextRef.current.play()
      try {
        await dianwuApi.scanAddToCart({
          barcode: e.detail.result,
          distributor_id
        })
        getCashierList()
        showToast($t('7187dbd0.edd566'))
      } catch (e) {
        console.error(e)
      }
      setTimeout(() => {
        scanIsUseableRef.current = true
      }, 2000)
    }
  }

  // 挂单
  const handleOrderPendding = async () => {
    if (cartList.length == 0) {
      Taro.navigateTo({
        url: `/subpages/dianwu/pending-checkout?distributor_id=${distributor_id}`,
        events: {
          // 取单事件
          onEventFetchOrder: () => {
            getCashierList()
          }
        }
      })
      return
    }
    const { confirm } = await Taro.showModal({
      title: $t('7187dbd0.d36db0'),
      content: $t('7187dbd0.a13882')
    })
    if (confirm) {
      try {
        await dianwuApi.orderPendding({
          user_id: member?.userId,
          distributor_id,
          showError: false
        })
        if (!member) {
          getCashierList()
        } else {
          dispatch(selectMember(null))
        }
      } catch (e) {
        if (e.res.data.data?.code == '42201') {
          const pendingModal = await Taro.showModal({
            title: $t('7187dbd0.6edb46'),
            content: e.res.data.data.message,
            confirmText: $t('7187dbd0.6dcf61')
          })
          if (pendingModal.confirm) {
            Taro.navigateTo({
              url: `/subpages/dianwu/pending-checkout?distributor_id=${distributor_id}`,
              events: {
                // 取单事件
                onEventFetchOrder: () => {
                  getCashierList()
                }
              }
            })
          }
        } else {
          showToast(e.res.data.data.message)
        }
      }
    }
  }

  const handleCreateMember = async () => {
    const res = await dianwuApi.createMember({ mobile })
    const newUser = pickBy(res, doc.dianwu.CREATE_MEMBER_ITEM)
    const userInfo = await dianwuApi.getMemberByUserId({ user_id: newUser.userId })
    const { couponNum, point, vipDiscount } = pickBy(userInfo, doc.dianwu.MEMBER_INFO)
    dispatch(
      selectMember({
        ...newUser,
        couponNum,
        point,
        vipDiscount
      })
    )
    setState((draft) => {
      draft.addUserCurtain = false
    })
  }

  const onChangeMobile = (e) => {
    setState((draft) => {
      draft.mobile = e
    })
  }

  const handleConfirm = async () => {
    if (validate.isMobileNum(mobile)) {
      const { list } = await dianwuApi.getMembers({
        mobile
      })
      setState((draft) => {
        draft.searchMemberResult = pickBy(list, doc.dianwu.MEMBER_ITEM)
      })
    } else {
      showToast($t('7187dbd0.a32ab5'))
    }
  }

  const onChangePlus = async (item, idx, index) => {
    const _num = parseInt(item.num) + 1
    if (_num > item.store) {
      return
    }
    // setState((draft) => {
    //   draft.cartList[idx].list[index].num = _num
    // })
    onChangeInputNumber(item, _num)
  }

  const onChangeMinus = async (item, idx, index) => {
    const _num = parseInt(item.num) - 1
    if (_num == 0) {
      return
    }
    // setState((draft) => {
    //   draft.cartList[idx].list[index].num = _num
    // })
    onChangeInputNumber(item, _num)
  }

  return (
    <SpPage
      className='page-dianwu-cashier'
      footerHeight={cartList.length > 0 ? 202 + 66 : 202}
      ref={pageRef}
      renderFooter={
        <View>
          {cartList.length > 0 && (
            <View className='total-bar'>
              <View className='lf'>
                <View className='total-mount'>
                  {$t('7187dbd0.450efd')} <SpPrice size={28} value={cartList[0]?.totalPrice} />
                </View>
                <View className='discount-mount'>
                  {$t('7187dbd0.0997f9')} <SpPrice size={28} value={cartList[0]?.discountFee} />
                </View>
              </View>
              <View
                className='rg'
                onClick={() => {
                  setState((draft) => {
                    draft.discountDetailLayout = true
                  })
                }}
              >
                {$t('7187dbd0.ce989f')}
                <Text className='iconfont icon-qianwang-01'></Text>
              </View>
            </View>
          )}
          <View className='footer-wrap'>
            <View className='total-info'>
              <View className='real-mount'>
                <Text className='label'>{$t('7187dbd0.fccab9')} </Text>
                <SpPrice value={cartList[0]?.totalFee || 0} />
              </View>
              <View className='txt'>{ti('7187dbd0.13a851', [cartList[0]?.totalNum || 0])}</View>
            </View>
            <View className='g-button'>
              <View className='g-button__first' onClick={handleOrderPendding}>
                {cartList.length == 0 ? $t('7187dbd0.b10acb') : $t('7187dbd0.ee5b0a')}
              </View>
              <View
                className='g-button__second'
                onClick={() => {
                  if (cartList.length == 0) {
                    showToast($t('7187dbd0.dd2124'))
                    return
                  }

                  setState((draft) => {
                    draft.isCameraOpend = false
                  })
                  Taro.navigateTo({
                    url: `/subpages/dianwu/checkout?distributor_id=${distributor_id}`,
                    events: {
                      onEventFetchOrder: () => {
                        getCashierList()
                      }
                    }
                  })
                }}
              >
                {$t('7187dbd0.181c56')}
              </View>
            </View>
          </View>
          <CompTabbar />
        </View>
      }
    >
      <View className='block-tools'>
        <SpSearchInput
          placeholder={$t('7187dbd0.68800b')}
          onConfirm={(val) => {
            setState((draft) => {
              draft.keywords = val
              // draft.searchResultLayout = true
            })
          }}
        />
        {!member && (
          <View
            className='btn-adduser'
            onClick={() => {
              setState((draft) => {
                draft.addUserCurtain = true
              })
            }}
          >
            <Text className='iconfont icon-xinzenghuiyuan-01'></Text> {$t('7187dbd0.3a6fa4')}
            {/* <View className='g-button__second' onClick={handleScanCode}>
              <Text className='iconfont icon-saoma'></Text>扫商品/会员码
            </View> */}
          </View>
        )}
        {member && (
          <View className='member-info'>
            <View
              className='lf'
              onClick={() => {
                setState((draft) => {
                  draft.addUserCurtain = true
                })
              }}
            >
              <View className='name'>{member.username || $t('7187dbd0.1a75c1')}</View>
              <View className='mobile'>{member.mobile}</View>
            </View>
            <View className='rg'>
              {/* <View className='cash'>
                会员折扣：<Text className='cash-value'>8.8</Text>
              </View> */}
              <View
                className='btn-clear'
                onClick={() => {
                  dispatch(selectMember(null))
                }}
              >
                <Text className='iconfont icon-shanchu-011'></Text>
              </View>
            </View>
          </View>
        )}
        <View className='code-to-cart' onClick={handleScanGoodsBN}>
          <View className='iconfont icon-saoma code-to-cart-icon'></View>
          <View className='code-to-cart-text'>{$t('7187dbd0.0296bf')}</View>
        </View>
      </View>
      {/* {isCameraOpend && (
        <View class='scan-code-wrap' >
          <Camera className='scan-code-camera' mode='scanCode' onScanCode={handleScanCodeByGoods} />
          <View
            className='scan-code-close'
            onClick={() => {
              setState((draft) => {
                draft.isCameraOpend = false
              })
            }}
          >
            关闭扫码
          </View>
        </View>
      )} */}
      {/* <View
        className='camera-placeholder'
        onClick={handleScanGoodsBN}
        // onClick={() => {
        //   setState((draft) => {
        //     draft.isCameraOpend = true
        //   })
        // }}
      >
        <View className='camera-placeholder-wrap'>
          <View className='iconfont icon-camera'></View>
          <View>点击开启摄像头扫码</View>
        </View>
      </View> */}

      {/* <View className='block-promation'>
        {[1, 2, 3].map((item, index) => (
          <View className='promation-item' key={`promation-item__${index}`}>
            <View>
              <Text className='tag'>满减</Text>
              <Text className='txt'>还差¥20即可减100</Text>
            </View>
            <View className='btn-add'>
              去凑单<Text className='iconfont icon-qianwang-01'></Text>
            </View>
          </View>
        ))}
      </View> */}
      <ScrollView className='item-list' scrollY>
        {cartList[0]?.list.length == 0 && (
          <SpNote img='empty_data.png' title={$t('7187dbd0.fb857c')} />
        )}
        {cartList[0]?.list.length > 0 && (
          <View className='block-goods'>
            {cartList.map((shopList, idx) => {
              return shopList.list.map((item, index) => (
                <View className='item-wrap' key={`item-wrap__${idx}_${index}`}>
                  <View className='item-caption'>
                    <View className='item-hd'>
                      <SpImage src={item.pic} width={120} height={120} />
                      {/*
                      <View className='btn-delete' onClick={handleDeleteCartItem.bind(this, item)}>
                        <Text className='iconfont icon-trashCan'></Text>
                      </View>
                      */}
                    </View>
                    <View className='item-bd'>
                      <View className='title'>
                        {item.isPrescription == 1 && item.isMedicine && (
                          <Text className='prescription-drug'>{$t('7187dbd0.e8b7e1')}</Text>
                        )}
                        {item.itemName}
                      </View>
                      {item.itemSpecDesc && <View className='sku'>{item.itemSpecDesc}</View>}
                      <View className='ft-info'>
                        <CompGoodsPrice info={item} />
                      </View>
                    </View>
                  </View>
                  <View className='item-option'>
                    <View className='item-option-count'>
                      <View
                        className='count-option iconfont icon-minus'
                        onClick={onChangeMinus.bind(this, item, idx, index)}
                      ></View>
                      <View
                        className='count-option iconfont icon-plus'
                        onClick={onChangePlus.bind(this, item, idx, index)}
                      ></View>
                    </View>
                    <View className='item-option-input'>
                      <AtInput
                        name={`at-number_${idx}_${index}`}
                        value={item.num}
                        type='number'
                        min={1}
                        onBlur={(value) => {
                          if (value) {
                            onChangeInputNumber(item, value)
                          }
                        }}
                        // onBlur={(num) => {
                        //   setState(
                        //     (draft) => {
                        //       draft.cartList[idx].list[index].num = num == '' || num == 0 ? 1 : num
                        //     },
                        //     () => {
                        //       onChangeInputNumber(item, num)
                        //     }
                        //   )
                        // }}
                      />
                    </View>
                    <View
                      className='item-option-del iconfont icon-trashCan'
                      onClick={handleDeleteCartItem.bind(this, item)}
                    ></View>
                  </View>
                  {/*
                      <SpInputNumber
                        value={item.num}
                        min={1}
                        onChange={(num) => {
                          setState((draft) => {
                            draft.cartList[idx].list[index].num = num
                          })
                          onChangeInputNumber(item, num)
                        }}
                      />
                  */}
                </View>
              ))
            })}
            {cartList[0]?.giftActivity && (
              <View className='gift-block'>
                {cartList[0]?.giftActivity.map((act, m) => {
                  return act.gifts.map((gift, n) => (
                    <View className='gift-item' key={`gift-item__${m}__${n}`}>
                      <View className='gift-tag'>{$t('7187dbd0.d017cc')}</View>
                      <View className='gift-content'>{gift.itemName}</View>
                      {gift.item_spec_desc && (
                        <Text className='gift-sku'>（{gift.item_spec_desc}）</Text>
                      )}
                    </View>
                  ))
                })}
              </View>
            )}
          </View>
        )}

        {/* {cartList[0]?.giftActivity.length > 0 && (
          <View className='block-gift'>
            <View className='gift-tag'>赠品</View>
            {cartList.map((shopList, idx) => {
              return shopList.giftActivity.map((item, index) => {
                return item.gifts.map((gift, gindex) => (
                  // <CompGift info={gift} key={`gift-item__${idx}_${index}_${gindex}`} />
                  <View className='activity-item'>
                    <View className='activity-tag'>{PROMOTION_TAG()[item.activity_type]}</View>
                    <View className='activity-content'>{item.item_name}</View>
                  </View>
                ))
              })
            })}
          </View>
        )} */}
      </ScrollView>

      <SpFloatLayout
        title={$t('7187dbd0.ce989f')}
        open={discountDetailLayout}
        onClose={() => {
          setState((draft) => {
            draft.discountDetailLayout = false
          })
        }}
      >
        <View className='discount-detail'>
          <SpCell title={ti('7187dbd0.631d07', [cartList[0]?.totalNum])}>
            <SpPrice value={cartList[0]?.totalPrice}></SpPrice>
          </SpCell>
          <SpCell title={$t('7187dbd0.7d9bcd')}>
            <SpPrice value={`-${cartList[0]?.promotionFee}`}></SpPrice>
          </SpCell>
          <SpCell title={$t('7187dbd0.eababe')}>
            <SpPrice value={`-${cartList[0]?.memberDiscount}`}></SpPrice>
          </SpCell>
        </View>
      </SpFloatLayout>

      <SpFloatLayout
        className='layout-search-result'
        title={
          <Text className='label'>
            {$t('7187dbd0.36e3c0')} <Text className='keywords'>{keywords}</Text>
          </Text>
        }
        open={searchResultLayout}
        onClose={() => {
          setState((draft) => {
            draft.searchResultLayout = false
          })
        }}
      >
        <ScrollView className='tab-scroll-list' scrollY>
          {searchGoodsList.map((item, index) => (
            <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
              <CompGoods info={item}>
                {item.store > 0 && item.isTotalStore === true && (
                  <AtButton
                    circle
                    className='btn-add-cart'
                    onClick={handleAddToCart.bind(this, item)}
                  >
                    {$t('7187dbd0.cd2240')}
                  </AtButton>
                )}

                {item.store == 0 && item.platformStore > 0 && (
                  <AtButton
                    className='btn-add-cart btn-platform-order'
                    circle
                    onClick={() => {
                      setState((draft) => {
                        draft.platformOrderItem = item
                      })
                    }}
                  >
                    立即下单
                  </AtButton>
                )}
              </CompGoods>
            </View>
          ))}
        </ScrollView>
      </SpFloatLayout>

      <CompDianwuPlatformOrder
        open={!!platformOrderItem}
        item={platformOrderItem}
        distributor_id={distributor_id}
        onClose={() => {
          setState((draft) => {
            draft.platformOrderItem = null
          })
        }}
        onEventFetchOrder={getCashierList}
      />

      <CompDianwuSelectMember
        open={addUserCurtain}
        distributor_id={distributor_id}
        onClose={() => {
          setState((draft) => {
            draft.addUserCurtain = false
          })
        }}
      />
    </SpPage>
  )
}

DianWuCashier.options = {
  addGlobalClass: true
}

export default DianWuCashier
