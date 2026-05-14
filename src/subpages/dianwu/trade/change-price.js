/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import * as dianwuApi from '@/api/dianwu'
import doc from '@/subpages/doc'
import { AtButton } from 'taro-ui'
import { SpPage, SpCell, SpSelect, SpImage, SpPrice, SpCheckbox } from '@/components'
import { View, Text, ScrollView } from '@tarojs/components'
import { classNames, pickBy, validate, showToast } from '@/utils'
import Big from 'big.js'
import { useTranslation, $t, ti } from '@/i18n'
import { useNavigation } from '@/hooks'
import CompInput from './../comps/comp-input'
import './change-price.scss'

const initialState = {
  changeType: [1],
  showTip: false,
  trade_id: '',
  buyMember: '',
  receiveName: '',
  receiveAddress: '',
  list: [],
  isZiti: false,
  itemFeeNew: 0,
  freightFee: 0,
  totalFee: 0,
  globalPrice: '',
  globalFreightFee: '',
  isFreeFreight: false,
  pointFreightFee: '',
  receiptType: null
}
function DianwuChangePrice(props) {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const [state, setState] = useImmer(initialState)
  const {
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
    pointFreightFee,
    receiptType
  } = state
  const $instance = getCurrentInstance() || {}
  const { trade_id } = $instance?.router?.params

  const changeTypeList = useMemo(
    () => [
      { id: 1, name: $t('b6f6de4c.5aea83') },
      { id: 2, name: $t('b6f6de4c.88dd0b') }
    ],
    [i18n.language]
  )

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('a8726ac1.30913f'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

  useEffect(() => {
    fetchOrderInfo()
  }, [])

  const fetchOrderInfo = async () => {
    const res = await dianwuApi.getTradeDetail(trade_id)
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

    const { username, mobile } = await dianwuApi.getMemberByUserId({ user_id })

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
      draft.receiptType = receipt_type
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
          : new Big(item.totalFee).times(100).toNumber()
      } else {
        total_fee = !isNaN(parseFloat(item.changeDiscount))
          ? new Big(item.changeDiscount).times(item.totalFee).toNumber()
          : new Big(item.totalFee).times(100).toNumber()
      }
      return {
        item_id: item.itemId,
        total_fee: total_fee
      }
    })
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
    const res = await dianwuApi.changePrice(params)
    const { items, itemFeeNew, freightFee, totalFee, point_freight_fee } = pickBy(
      res,
      doc.dianwu.ORDER_INFO
    )
    showToast($t('b6f6de4c.af9b30'))
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
    await dianwuApi.changePriceConfirm(params)
    showToast($t('b6f6de4c.af9b30'))
    setTimeout(() => {
      Taro.navigateBack()
    }, 2000)
  }

  const changeLabelKey = changeType[0] == 1 ? 'b6f6de4c.5aea83' : 'b6f6de4c.bcf174'

  return (
    <SpPage
      className={classNames('page-dianwu-change-price', {
        'show-tip': showTip
      })}
      renderFooter={
        <AtButton circle type='primary' onClick={onConfirmChangePrice}>
          {$t('b6f6de4c.b83e53')}
        </AtButton>
      }
    >
      <ScrollView className='scroll-list' scrollY>
        <View className='order-block bottom-line'>
          <SpCell title={$t('19bf4265.6e87f7')}>{trade_id}</SpCell>
          <SpCell title={$t('19bf4265.74948e')}>{buyMember}</SpCell>
          <SpCell title={isZiti ? $t('19bf4265.d5403f') : $t('19bf4265.6aea70')}>
            {receiveName}
          </SpCell>
          <SpCell title={isZiti ? $t('19bf4265.f0c36d') : $t('19bf4265.748ea9')}>
            {receiveAddress}
          </SpCell>
        </View>
        <View className='goods-block bottom-line'>
          <View className='block-hd'>
            <View className='hd-title'>{$t('b6f6de4c.3a1bbf')}</View>
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
                  {item.itemSpecDesc && (
                    <View className='item-sku'>{ti('c3455657.d0c997', [item.itemSpecDesc])}</View>
                  )}
                  <View className='item-price'>{itemPriceFormat(item)}</View>
                  <View className='change-price-block'>
                    <Text className='label'>{$t(changeLabelKey)}</Text>

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
          <Text className='label'>{$t('b6f6de4c.269dbc')}</Text>
          <SpPrice value={itemFeeNew} />
        </View>
        <View className='block-bd'>
          <View className='bd-item'>
            <Text className='label'>{$t('b6f6de4c.40b3ba')}</Text>
            <CompInput
              value={globalPrice}
              name='global-price'
              prefix='¥'
              onChange={onChangeGlobalPrice}
            />
            <View className='bd-item-ft'>
              <AtButton className='btn-change' circle onClick={handleGlobalChangePrice}>
                {$t('349e8d9f.38cf16')}
              </AtButton>
            </View>
          </View>
          <View className='bd-item'>
            <Text className='label'>{$t('b6f6de4c.9a935b')}</Text>
            <CompInput
              value={globalFreightFee}
              name='global-freight'
              prefix='¥'
              disabled={isFreeFreight || receiptType == 'dada'}
              onChange={onChangeGlobalFreight}
              onConfirm={onConfirmGlobalFreight}
            />
            <View className='bd-item-ft'>
              <SpCheckbox
                checked={isFreeFreight}
                disabled={receiptType == 'dada'}
                onChange={onChangeFreeFreight}
              >
                {$t('b6f6de4c.b00a4f')}
              </SpCheckbox>
            </View>
          </View>
        </View>
        <View className='block-ft'>
          <View className='label'>
            {$t('b6f6de4c.cfcd5e')}
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
            <View className='tip-txt'>{$t('b6f6de4c.e0a13b')}</View>
            <View className='tip-txt'>{$t('b6f6de4c.4983fd')}</View>
            <View className='tip-txt'>{$t('b6f6de4c.56e179')}</View>
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
