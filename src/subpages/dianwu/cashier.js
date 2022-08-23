import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidHide } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text, ScrollView, Camera } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtButton, AtCurtain, AtInput } from 'taro-ui'
import {
  SpPage,
  SpSearchInput,
  SpPrice,
  SpImage,
  SpVipLabel,
  SpInputNumber,
  SpFloatLayout,
  SpCell,
  SpNote
} from '@/components'
import { useDianWuLogin, useDebounce } from '@/hooks'
import { styleNames, pickBy, showToast, classNames, validate } from '@/utils'
import { selectMember } from '@/store/slices/dianwu'
import CompGoods from './comps/comp-goods'
import CompGift from './comps/comp-gift'
import CompGoodsPrice from './comps/comp-goods-price'
import './cashier.scss'

const initialState = {
  keywords: '',
  typeList: [
    { title: '商品', value: 'goods' },
    { title: '会员', value: 'member' }
  ],
  current: 0,
  cartList: [],
  mobile: '',
  searchGoodsList: [],
  searchMemberResult: null,
  discountDetailLayout: false,
  searchResultLayout: false,
  addUserCurtain: false,
  isCameraOpend: false
}

function DianWuCashier() {
  const [state, setState] = useImmer(initialState)
  const {
    keywords,
    typeList,
    current,
    cartList,
    mobile,
    discountDetailLayout,
    searchResultLayout,
    addUserCurtain,
    searchGoodsList,
    searchMemberResult,
    isCameraOpend
  } = state
  const pageRef = useRef()
  const scanIsUseableRef = useRef(true)
  const audioContextRef = useRef()
  const $instance = getCurrentInstance()
  const { distributor_id } = $instance.router.params
  const { member } = useSelector((state) => state.dianwu)
  const dispatch = useDispatch()

  useDianWuLogin()

  useEffect(() => {
    audioContextRef.current = wx.createInnerAudioContext({
      useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    })
    audioContextRef.current.src = `${process.env.APP_IMAGE_CDN}/scan_success.wav`
  })

  useEffect(() => {
    getCashierList()
  }, [member])

  useEffect(() => {
    if (discountDetailLayout || searchResultLayout || addUserCurtain) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [discountDetailLayout, searchResultLayout, addUserCurtain])

  useEffect(() => {
    if (keywords) {
      handleSearchByKeyword(keywords)
    }
  }, [keywords])

  const handleSearchByKeyword = async (keywords) => {
    Taro.showLoading()
    const { list: goodsList } = await api.dianwu.goodsItems({
      page: 1,
      pageSize: 100,
      keywords
    })
    Taro.hideLoading()

    setState((draft) => {
      draft.searchGoodsList = pickBy(goodsList, doc.dianwu.GOODS_ITEM)
      // draft.searchMemberList = pickBy(memberList, doc.dianwu.MEMBER_ITEM)
      draft.searchResultLayout = true
    })
  }

  const handleScanCode = async () => {
    const { errMsg, result } = await Taro.scanCode()
    console.log('handleScanCode:', result)
    if (errMsg == 'scanCode:ok') {
      const { list } = await api.dianwu.getMembers({
        user_card_code: result.split('_')[1]
      })
      console.log(pickBy(list, doc.dianwu.MEMBER_ITEM))
      setState((draft) => {
        draft.searchMemberResult = pickBy(list, doc.dianwu.MEMBER_ITEM)
      })
    } else {
      showToast(errMsg)
    }
  }

  const getCashierList = async () => {
    const { valid_cart } = await api.dianwu.getCartDataList({
      user_id: member?.userId,
      distributor_id
    })
    setState((draft) => {
      draft.cartList = pickBy(valid_cart, doc.dianwu.CART_GOODS_ITEM)
    })
  }

  const onChangeInputNumber = useDebounce(async ({ cartId, itemId }, num) => {
    await api.dianwu.updateCartData({
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
      title: '提示',
      content: '将当前商品移出收银台?',
      showCancel: true,
      cancel: '取消',
      cancelText: '取消',
      confirmText: '确认'
    })
    if (!confirm) return
    await api.dianwu.deleteCartData(cartId)
    getCashierList()
  }

  const handleAddToCart = async ({ itemId }) => {
    await api.dianwu.addToCart({
      item_id: itemId,
      num: 1,
      distributor_id
    })
    getCashierList()
    showToast('加入收银台成功')
  }

  const handleScanCodeByGoods = async (e) => {
    console.log('handleScanCodeByGoods:', e, scanIsUseableRef.current)
    if (scanIsUseableRef.current) {
      scanIsUseableRef.current = false
      audioContextRef.current.play()
      try {
        await api.dianwu.scanAddToCart({
          barcode: e.detail.result,
          distributor_id
        })
        getCashierList()
        showToast('加入收银台成功')
      } catch (e) {
        console.error(e)
      }
      setTimeout(() => {
        scanIsUseableRef.current = true
      }, 2000)
    }
  }

  // 选择会员
  const handleSelectMember = () => {
    const [item] = searchMemberResult
    dispatch(selectMember(item))
    setState((draft) => {
      draft.addUserCurtain = false
    })
  }

  const handleCreateMember = async () => {
    const res = await api.dianwu.createMember({ mobile })
    const newUser = pickBy(res, doc.dianwu.CREATE_MEMBER_ITEM)
    dispatch(selectMember(newUser))
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
      const { list } = await api.dianwu.getMembers({
        mobile
      })
      setState((draft) => {
        draft.searchMemberResult = pickBy(list, doc.dianwu.MEMBER_ITEM)
      })
    } else {
      showToast('请输入正确的手机号')
    }
  }

  const onChangePlus = async (item, idx, index) => {
    const _num = parseInt(item.num) + 1
    if(_num > item.store) {
      return
    }
    setState((draft) => {
      draft.cartList[idx].list[index].num = _num
    })
    onChangeInputNumber(item, _num)
  }

  const onChangeMinus = async (item, idx, index) => {
    const _num = parseInt(item.num) - 1
    if(_num == 0) {
      return
    }
    setState((draft) => {
      draft.cartList[idx].list[index].num = _num
    })
    onChangeInputNumber(item, _num)
  }

  return (
    <SpPage
      className='page-dianwu-cashier'
      ref={pageRef}
      renderFooter={
        <View className='footer-wrap'>
          <View className='total-info'>
            <View className='real-mount'>
              <Text className='label'>实收 </Text>
              <SpPrice value={cartList[0]?.totalFee} />
            </View>
            <View className='txt'>已选择{cartList[0]?.totalNum}件商品</View>
          </View>
          <View className='g-button'>
            <View className='g-button__first'>挂单</View>
            <View
              className='g-button__second'
              onClick={() => {
                setState((draft) => {
                  draft.isCameraOpend = false
                })
                Taro.navigateTo({ url: `/subpages/dianwu/checkout?distributor_id=${distributor_id}` })
              }}
            >
              结算收银
            </View>
          </View>
        </View>
      }
    >
      <View className='block-tools'>
        <SpSearchInput
          placeholder='商品名称/商品货号/商品条形码'
          onConfirm={(val) => {
            setState((draft) => {
              draft.keywords = val
              // draft.searchResultLayout = true
            })
          }}
        />
        <AtButton
          className='btn-adduser'
          circle
          onClick={() => {
            setState((draft) => {
              draft.addUserCurtain = true
            })
          }}
        >
          <Text className='iconfont icon-xinzenghuiyuan-01'></Text>选择会员
          {/* <View className='g-button__second' onClick={handleScanCode}>
            <Text className='iconfont icon-saoma'></Text>扫商品/会员码
          </View> */}
        </AtButton>
      </View>
      { isCameraOpend && (
        <Camera className='scan-code' mode='scanCode' onScanCode={handleScanCodeByGoods} />
      )}
      { !isCameraOpend && (
        <View className='camera-placeholder' onClick={() => {
            setState((draft) => {
              draft.isCameraOpend = true
            })
          }}
        >
          <View className='camera-placeholder-wrap'>
            <View className='iconfont icon-camera'></View>
            <View>点击开启摄像头扫码</View>
          </View>
        </View>
      )}
      {member && (
        <View className='member-info'>
          <View className='lf'>
            <Text className='name'>{member.username || '未知'}</Text>
            <Text className='mobile'>{member.mobile}</Text>
          </View>
          <View className='rg'>
            {/* <View className='cash'>
              会员折扣：<Text className='cash-value'>8.8</Text>
            </View> */}
            <View
              className='btn-clear'
              onClick={() => {
                dispatch(selectMember(null))
                setState((draft) => {
                  draft.mobile = ''
                  draft.searchMemberResult = null
                })
              }}
            >
              清除
            </View>
          </View>
        </View>
      )}

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

      {cartList[0]?.list.length == 0 && <SpNote img='empty_data.png' title='暂时还没有商品' />}
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
                    <View className='title'>{item.itemName}</View>
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
                      onBlur={(num) => {
                        setState((draft) => {
                          draft.cartList[idx].list[index].num = (num == '' ||  num == 0) ? 1 : num
                        },() => {
                          onChangeInputNumber(item, num)
                        })
                      }}
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
        </View>
      )}
      {cartList[0]?.giftActivity.length > 0 && (
        <View className='block-gift'>
          {cartList.map((shopList, idx) => {
            return shopList.giftActivity.map((item, index) => {
              return item.gifts.map((gift, gindex) => (
                <CompGift info={gift} key={`gift-item__${idx}_${index}_${gindex}`} />
              ))
            })
          })}
        </View>
      )}

      <View className='total-bar'>
        <View className='lf'>
          <View className='total-mount'>
            合计 <SpPrice size={38} value={cartList[0]?.totalPrice} />
          </View>
          <View className='discount-mount'>
            已优惠 <SpPrice size={38} value={cartList[0]?.discountFee} />
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
          优惠详情<Text className='iconfont icon-qianwang-01'></Text>
        </View>
      </View>

      <SpFloatLayout
        title='优惠详情'
        open={discountDetailLayout}
        onClose={() => {
          setState((draft) => {
            draft.discountDetailLayout = false
          })
        }}
      >
        <View className='discount-detail'>
          <SpCell title={`${cartList[0]?.totalNum}件商品合计`}>
            <SpPrice value={cartList[0]?.totalPrice}></SpPrice>
          </SpCell>
          <SpCell title='促销优惠'>
            <SpPrice value={`-${cartList[0]?.promotionFee}`}></SpPrice>
          </SpCell>
          <SpCell title='会员折扣'>
            <SpPrice value={`-${cartList[0]?.memberDiscount}`}></SpPrice>
          </SpCell>
        </View>
      </SpFloatLayout>

      <SpFloatLayout
        className='layout-search-result'
        title={
          <Text className='label'>
            查询内容: <Text className='keywords'>{keywords}</Text>
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
                {item.store > 0 && (
                  <AtButton
                    circle
                    className={classNames({ 'active': true })}
                    onClick={handleAddToCart.bind(this, item)}
                  >
                    <Text className='iconfont icon-plus'></Text>
                  </AtButton>
                )}

                {item.store == 0 && (
                  <AtButton circle disabled>
                    缺货
                  </AtButton>
                )}
              </CompGoods>
            </View>
          ))}
        </ScrollView>
      </SpFloatLayout>

      <AtCurtain
        isOpened={addUserCurtain}
        onClose={() => {
          setState((draft) => {
            draft.addUserCurtain = false
          })
        }}
      >
        <View className='search-user'>
          <View className='search-user-hd'>
            <View className='title'>查询会员</View>
            <View className='scan-member' onClick={handleScanCode}>
              <Text className='iconfont icon-saoma'></Text>扫会员码
            </View>
          </View>
          <View className='search-user-bd'>
            <View className='form-field'>
              <AtInput
                name='mobile'
                value={mobile}
                className='mobile'
                placeholder='请输入手机号'
                onChange={onChangeMobile}
                onConfirm={handleConfirm}
              />
            </View>
            <View className='search-result'>
              {searchMemberResult?.length == 0 && <Text>没有找到会员</Text>}
              {searchMemberResult?.length > 0 && (
                <Text>{`${searchMemberResult[0]?.username} ${searchMemberResult[0]?.mobile}`}</Text>
              )}
            </View>
          </View>
          <View className='search-user-ft'>
            <View
              className='btn-cancel'
              onClick={() => {
                setState((draft) => {
                  draft.addUserCurtain = false
                })
              }}
            >
              取消
            </View>
            {searchMemberResult?.length > 0 && (
              <AtButton className='btn-confirm' onClick={handleSelectMember}>
                选择会员
              </AtButton>
            )}
            {searchMemberResult?.length == 0 && (
              <AtButton className='btn-confirm' onClick={handleCreateMember}>
                立即创建
              </AtButton>
            )}
          </View>
        </View>
      </AtCurtain>
    </SpPage>
  )
}

DianWuCashier.options = {
  addGlobalClass: true
}

export default DianWuCashier
