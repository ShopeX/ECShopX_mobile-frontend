import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { SpPage, SpCell, SpSelect, SpImage, SpPrice, SpCheckbox } from '@/components'
import { View, Text, ScrollView } from '@tarojs/components'
import { classNames, pickBy, validate, showToast, isNumber } from '@/utils'
import Big from 'big.js'
import CompInput from './../comps/comp-input'
import './change-price.scss'

const initialState = {
  changeTypeList: [
    { id: 1, name: '直接改价' },
    { id: 2, name: '折扣改价' }
  ],
  changeType: [1],
  showTip: false,
  trade_id: '',
  buyMember: '',
  receiveName: '',
  receiveAddress: '',
  list: [],
  isZiti: false, // 自提订单
  itemFeeNew: 0, // 商品应付金额
  freightFee: 0, // 运费
  totalFee: 0, // 订单应付金额
  globalPrice: '',
  globalFreightFee: '',
  isFreeFreight: false,
  pointFreightFee: ''
}
function DianwuChangePrice(props) {
  const [state, setState] = useImmer(initialState)
  const {
    changeTypeList,
    changeType,
    showTip,
    buyMember,
    receiveName,
    receiveAddress,
    isZiti,
    list,
    itemFeeNew,
    freightFee,
    totalFee,
    globalPrice,
    globalFreightFee,
    isFreeFreight,
    pointFreightFee
  } = state
  const $instance = getCurrentInstance()
  const { trade_id } = $instance.router.params

  useEffect(() => {
    fetchOrderInfo()
  }, [])

  const fetchOrderInfo = async () => {
    const res = await api.dianwu.getTradeDetail(trade_id)
    const { orderInfo, distributor } = res
    const {
      items: _items,
      user_id,
      receiver_name,
      receiver_mobile,
      receiver_state,
      receiver_city,
      receiver_district,
      receiver_address,
      order_class,
      receipt_type,
      itemFeeNew,
      freightFee,
      totalFee,
      pointFreightFee
    } = pickBy(orderInfo, doc.dianwu.ORDER_INFO)

    const { store_address, store_name } = distributor

    const { username, mobile } = await api.dianwu.getMemberByUserId({ user_id })

    let _buyMember = ''
    let _receiveName = ''
    let _receiveAddress = ''
    let _isZiti = false

    if (
      order_class == 'excard' ||
      order_class == 'shopadmin' ||
      (order_class == 'normal' && receipt_type == 'ziti')
    ) {
      _buyMember = `${username} ${mobile}`
      _receiveName = `${username}（${mobile}）`
      _receiveAddress = `${store_address}（${store_name}）`
      _isZiti = true
    } else {
      _buyMember = `${username} ${mobile}`
      _receiveName = `${receiver_name}（${receiver_mobile}）`
      _receiveAddress = `${receiver_state}${receiver_city}${receiver_district}${receiver_address}`
      _isZiti = false
    }

    _items.forEach((item) => {
      item['changePrice'] = ''
      item['changeDiscount'] = ''
    })

    setState((draft) => {
      draft.buyMember = _buyMember
      draft.receiveName = _receiveName
      draft.receiveAddress = _receiveAddress
      draft.isZiti = _isZiti
      draft.list = _items
      draft.itemFeeNew = itemFeeNew
      draft.freightFee = freightFee
      draft.totalFee = totalFee
      draft.globalFreightFee = new Big(freightFee).minus(pointFreightFee).toFixed(2)
      draft.pointFreightFee = pointFreightFee
    })
  }

  const onChangePrice = (index, value) => {
    setState((draft) => {
      draft.list[index].changePrice = validate.isMoney(value)
        ? value
        : value.substring(0, value.length - 1)
    })
  }

  const onChangeDiscount = (index, value) => {
    setState((draft) => {
      draft.list[index].changeDiscount = validate.isMoney(value)
        ? value
        : value.substring(0, value.length - 1)
    })
  }

  const onChangeGlobalPrice = (value) => {
    setState((draft) => {
      draft.globalPrice = validate.isMoney(value) ? value : value.substring(0, value.length - 1)
    })
  }

  const handleGlobalChangePrice = async () => {
    let params = {
      down_type: 'total',
      total_fee: globalPrice * 100
    }
    if (isFreeFreight) {
      params['freight_fee'] = 0
    } else if (!isNaN(parseFloat(globalFreightFee))) {
      params['freight_fee'] = globalFreightFee * 100
    }
    orderMarkdown(params)
  }

  const onChangeGlobalFreight = (value) => {
    setState((draft) => {
      draft.globalFreightFee = validate.isMoney(value)
        ? value
        : value.substring(0, value.length - 1)
    })
  }

  const getChangePriceParams = () => {
    let params = {
      down_type: 'items'
    }
    if (!isNaN(parseFloat(globalFreightFee))) {
      params['freight_fee'] = globalFreightFee * 100
    }
    if (isFreeFreight) {
      params['freight_fee'] = 0
    }
    params['items'] = list.map((item) => {
      let total_fee
      if (changeType[0] == 1) {
        total_fee = !isNaN(parseFloat(item.changePrice))
          ? new Big(item.changePrice).times(100).toNumber()
          : item.totalFee * 100
      } else {
        total_fee = !isNaN(parseFloat(item.changeDiscount))
          ? new Big(item.changeDiscount).times(item.totalFee).toNumber()
          : item.totalFee * 100
      }
      return {
        item_id: item.itemId,
        total_fee: total_fee
      }
    })
    debugger
    return params
  }

  const onConfirmItemChange = () => {
    const params = getChangePriceParams()
    orderMarkdown(params)
  }

  const onConfirmGlobalFreight = (e) => {
    const params = getChangePriceParams()
    orderMarkdown(params)
  }

  const itemPriceFormat = ({ totalFee, price, num, discountFee, point }) => {
    return `¥${totalFee.toFixed(2)} = ${price.toFixed(2)} x ${num} - ${discountFee.toFixed(
      2
    )} - ${point.toFixed(2)}`
  }

  // 是否免运费
  const onChangeFreeFreight = (e) => {
    let params = getChangePriceParams()
    setState((draft) => {
      draft.isFreeFreight = e
    })
    if (e) {
      params = {
        ...params,
        freight_fee: 0
      }
    }
    orderMarkdown(params)
  }

  const orderMarkdown = async (params) => {
    params = {
      ...params,
      order_id: trade_id
    }
    const res = await api.dianwu.changePrice(params)
    const { items, itemFeeNew, freightFee, totalFee, point_freight_fee } = pickBy(
      res,
      doc.dianwu.ORDER_INFO
    )
    showToast('订单价格修改成功')
    setState((draft) => {
      draft.list = items
      draft.itemFeeNew = itemFeeNew
      draft.freightFee = freightFee
      draft.totalFee = totalFee
    })
  }

  const onConfirmChangePrice = async () => {
    let params = getChangePriceParams()
    params = {
      ...params,
      order_id: trade_id
    }
    if (isFreeFreight) {
      params['freight_fee'] = 0
    }
    await api.dianwu.changePriceConfirm(params)
    showToast('订单价格修改成功')
    setTimeout(() => {
      Taro.navigateBack()
    }, 2000)
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
        <View className='order-block bottom-line'>
          <SpCell title='订单ID'>{trade_id}</SpCell>
          <SpCell title='买家'>{buyMember}</SpCell>
          <SpCell title={isZiti ? '提货人' : '收货人'}>{receiveName}</SpCell>
          <SpCell title={isZiti ? '提货地址' : '收货地址'}>{receiveAddress}</SpCell>
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
            {list.map((item, index) => (
              <View className='item-wrap' key={`item-wrap__${index}`}>
                <View className='item-image'>
                  <SpImage src={item.pic} width={160} height={160} circle={8} />
                </View>
                <View className='item-bd'>
                  <View className='item-title'>{item.itemName}</View>
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
          <View className='bd-item'>
            <Text className='label'>运费</Text>
            <CompInput
              value={globalFreightFee}
              name='global-freight'
              prefix='¥'
              disabled={isFreeFreight}
              onChange={onChangeGlobalFreight}
              onConfirm={onConfirmGlobalFreight}
            />
            <View className='bd-item-ft'>
              <SpCheckbox checked={isFreeFreight} onChange={onChangeFreeFreight}>
                免运费
              </SpCheckbox>
            </View>
          </View>
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
            <Text className='operator'>-</Text>
            <SpPrice value={pointFreightFee} />
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
