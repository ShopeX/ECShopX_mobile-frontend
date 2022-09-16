import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import qs from 'qs'
import { useAsyncCallback } from '@/hooks'
import { SpPage, SpCell, SpSelect, SpImage, SpPrice, SpCheckbox } from '@/components'
import { View, Text, ScrollView } from '@tarojs/components'
import { classNames, pickBy, validate, onEventChannel, showToast } from '@/utils'
import Big from 'big.js'
import CompInput from './comps/comp-input'
import './change-price.scss'

const initialState = {
  changeTypeList: [
    { id: 1, name: '直接改价' },
    { id: 2, name: '折扣改价' }
  ],
  items: [],
  changeType: [1],
  showTip: false,
  itemFeeNew: 0, // 商品应付金额
  freightFee: 0, // 运费
  totalFee: 0, // 订单应付金额
  globalPrice: '',
  globalFreightFee: ''
}
function DianwuChangePrice(props) {
  const [state, setState] = useImmer(initialState)
  const {
    changeTypeList,
    items,
    changeType,
    showTip,
    itemFeeNew,
    freightFee,
    totalFee,
    globalPrice,
    globalFreightFee
  } = state
  const $instance = getCurrentInstance()
  const { member } = useSelector((state) => state.dianwu)

  useEffect(() => {
    const { checkout } = $instance.router.params
    const params = qs.parse(decodeURIComponent(checkout))
    fetchCheckout(params)
  }, [])

  const fetchCheckout = async (params) => {
    const res = await api.dianwu.checkout(params)
    const {
      items: _items,
      itemFeeNew,
      freightFee,
      totalFee
    } = pickBy(res, doc.dianwu.CHECKOUT_GOODS_ITEM)
    _items.forEach((item) => {
      item['changePrice'] = ''
      item['changeDiscount'] = ''
    })
    setState((draft) => {
      draft.items = _items
      // total_fee - freight_fee + point_freight_fee
      draft.itemFeeNew = new Big(totalFee).minus(freightFee).toFixed(2)
      draft.freightFee = freightFee
      draft.totalFee = totalFee
    })
    return res
  }

  const onChangePrice = (index, value) => {
    setState((draft) => {
      draft.items[index].changePrice = validate.isMoney(value)
        ? value
        : value.substring(0, value.length - 1)
    })
  }

  const onChangeDiscount = (index, value) => {
    setState((draft) => {
      draft.items[index].changeDiscount = validate.isMoney(value)
        ? value
        : value.substring(0, value.length - 1)
    })
  }

  const onConfirmItemChange = () => {
    const params = getChangePriceParams(items)
    fetchCheckout(params)
  }

  const getChangePriceParams = (_items) => {
    const { checkout } = $instance.router.params
    const params = qs.parse(decodeURIComponent(checkout))
    let markdown = {}
    const tItems = _items.map((item) => {
      let total_fee
      // 直接改价
      if (changeType[0] == 1) {
        total_fee = item.changePrice ? new Big(item.changePrice).times(100).toNumber() : item.totalFee * 100
      } else if (changeType[0] == 2) {
        // 折扣改价
        total_fee = item.changeDiscount ? new Big(item.changeDiscount).times(item.totalFee).toNumber() : item.totalFee * 100
      }
      return {
        item_id: item.itemId,
        total_fee: total_fee
      }
    })

    markdown['items'] = tItems
    markdown['down_type'] = 'items'
    params['markdown'] = markdown
    return params
  }

  // 确认改价
  const onConfirmChangePrice = async () => {
    const params = getChangePriceParams(items)
    const res = await fetchCheckout(params)
    showToast('价格修改成功')
    onEventChannel('onEventChangePrice', { res, markdown: params.markdown })
    setTimeout(() => {
      Taro.navigateBack()
    }, 2000)
  }

  // 一键改价
  const onChangeGlobalPrice = (value) => {
    const _value = validate.isMoney(value) ? value : value.substring(0, value.length - 1)
    if(!validate.isMoney(value)) {
      console.log(_value)
    }
    setState((draft) => {
      draft.globalPrice = _value
    })
  }

  // 一键改价确定
  const handleGlobalChangePrice = async () => {
    const { checkout } = $instance.router.params
    const params = qs.parse(decodeURIComponent(checkout))
    let markdown = {}

    markdown['total_fee'] = globalPrice * 100
    markdown['down_type'] = 'total'
    params['markdown'] = markdown

    fetchCheckout(params)
  }

  const itemPriceFormat = ({ totalFee, price, num, discountFee, point = 0 }) => {
    return `¥${totalFee.toFixed(2)} = ${price.toFixed(2)} x ${num} - ${discountFee.toFixed(
      2
    )} - ${point.toFixed(2)}`
  }

  return (
    <SpPage
      className={classNames('page-dianwu-change-price', {
        'show-tip': showTip
      })}
      renderFooter={
        <AtButton circle type='primary' onClick={onConfirmChangePrice}>
          确认改价
        </AtButton>
      }
    >
      <ScrollView className='scroll-list' scrollY>
        <View className='block-user'>
          <SpImage src={member?.avatar || 'user_icon.png'} width={80} height={80} />
          <View className='user-info'>
            <View className='info-hd'>
              <Text className='name'>{member?.username || '匿名'}</Text>
              <Text className='mobile'>{member?.mobile}</Text>
            </View>
            <View className='info-bd'>
              <View className='filed-item'>
                <Text className='label'>积分:</Text>
                <Text className='value'>{member?.point || 0}</Text>
              </View>
              <View className='filed-item'>
                <Text className='label'>券:</Text>
                <Text className='value'>{member?.couponNum || 0}</Text>
              </View>
              {member?.vipDiscount < 10 && (
                <View className='filed-item'>
                  <Text className='label'>会员折扣:</Text>
                  <Text className='value'>{member?.vipDiscount || 0}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className='goods-block bottom-line'>
          <View className='block-hd'>
            <View className='hd-title'>改价方式</View>
            <SpSelect
              info={changeTypeList}
              value={changeType}
              onChange={(e) => {
                setState((draft) => {
                  draft.changeType = e
                })
              }}
            />
          </View>
          <View className='goods-list'>
            {items.map((item, index) => (
              <View className='item-wrap' key={`item-wrap__${index}`}>
                <View className='item-image'>
                  <SpImage src={item.pic} width={160} height={160} circle={8} />
                </View>
                <View className='item-bd'>
                  <View className='item-title'>{item.name}</View>
                  {item.itemSpecDesc && <View className='item-sku'>规格：{item.itemSpecDesc}</View>}
                  <View className='item-price'>{itemPriceFormat(item)}</View>
                  <View className='change-price-block'>
                    <Text className='label'>
                      {
                        {
                          1: '直接改价',
                          2: '改价折扣'
                        }[changeType[0]]
                      }
                    </Text>

                    {changeType[0] == 1 && (
                      <CompInput
                        name={`changeValue_${index}`}
                        prefix='¥'
                        value={item.changePrice}
                        onChange={onChangePrice.bind(this, index)}
                        onConfirm={onConfirmItemChange}
                      />
                    )}

                    {changeType[0] == 2 && (
                      <CompInput
                        name={`changeValue_${index}`}
                        suffix='%'
                        value={item.changeDiscount}
                        onChange={onChangeDiscount.bind(this, index)}
                        onConfirm={onConfirmItemChange}
                      />
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className='change-price-dialog'>
        <View className='block-hd'>
          <Text className='label'>商品应付金额</Text>
          <SpPrice value={itemFeeNew} />
        </View>
        <View className='block-bd'>
          <View className='bd-item'>
            <Text className='label'>一键改价</Text>
            <CompInput
              value={globalPrice}
              name='global-price'
              prefix='¥'
              onChange={onChangeGlobalPrice}
            />
            <View className='bd-item-ft'>
              <AtButton className='btn-change' circle onClick={handleGlobalChangePrice}>
                确定
              </AtButton>
            </View>
          </View>
          {/* <View className='bd-item'>
            <Text className='label'>运费</Text>
            <CompInput
              value={globalFreightFee}
              name='freight-price'
              prefix='¥'
              onChange={(e) => {
                setState((draft) => {
                  draft.globalFreightFee = e
                })
              }}
            />
            <View className='bd-item-ft'>{<SpCheckbox>免运费</SpCheckbox>}</View>
          </View> */}
        </View>
        <View className='block-ft'>
          <View className='label'>
            订单应付金额
            <Text
              className='iconfont icon-xinxi'
              onClick={() => {
                setState((draft) => {
                  draft.showTip = !showTip
                })
              }}
            ></Text>
          </View>
          <Text>
            <SpPrice value={itemFeeNew} />
            <Text className='operator'>+</Text>
            <SpPrice value={freightFee} />
            <Text className='operator'>=</Text>
            <SpPrice className='total-fee' value={totalFee} />
          </Text>
        </View>
        {showTip && (
          <View className='dialog-tip'>
            <View className='tip-txt'>订单应付金额 = 商品应付金额 + 运费。</View>
            <View className='tip-txt'>
              一键改价后的金额为商品总价，该金额会按商品单价的金额比例分摊到每个商品，不会分摊到优惠和运费。
            </View>
            <View className='tip-txt'>订单应付金额不能小于等于0。</View>
          </View>
        )}
      </View>
    </SpPage>
  )
}

DianwuChangePrice.options = {
  addGlobalClass: true
}

export default DianwuChangePrice
