/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { SpPage, SpImage, SpScrollView, SpCell, SpFloatLayout } from '@/components'
import { pickBy, showToast, classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import { ORDER_STATUS_INFO, DELIVERY_PERSONNEL_INFORMATION, ORDER_DADA_STATUS } from '@/consts'
import { AtButton } from 'taro-ui'
import CompShippingInformation from './comps/comp-shipping-information'
import tradeHooks from './hooks'
import CompTradeItem from './comps/comp-tradeitem'
import btnHooks from './btn-hooks'
import './detail.scss'

const initialConfigState = {
  information: {},
  statusDelivery: false,
  list: DELIVERY_PERSONNEL_INFORMATION()
}

const Detail = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const { information, list, statusDelivery } = state
  const goodsRef = useRef()
  const pageRef = useRef()
  const router = useRouter()

  const { deliveryPersonnel } = useSelector((state) => state.cart)
  const { tradeActionBtns, getTradeAction } = tradeHooks()
  const { popUpStatus, orderState, deliverySure } = btnHooks()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('75c4fca2.8054f7') })
  }, [i18n.language])

  useEffect(() => {
    // 获取个人信息
    goodsRef?.current.reset()
  }, [])

  useDidShow(() => {
    goodsRef?.current.reset()
  })

  useEffect(() => {
    if (statusDelivery) {
      pageRef?.current.pageLock()
    } else {
      pageRef?.current.pageUnLock()
    }
  }, [statusDelivery])

  const fetch = async () => {
    const { order_id } = router?.params
    const {
      orderInfo,
      total = 1,
      tradeInfo
    } = await api.trade.detail(order_id, { ...deliveryPersonnel })
    orderInfo.pay_date = tradeInfo.payDate
    orderInfo.trade_id = tradeInfo.tradeId
    const tempList = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    setState((draft) => {
      draft.information = tempList
    })
    return { total }
  }

  const getTradeStatusIcon = (info) => {
    return `${ORDER_STATUS_INFO()[info.orderStatus]?.icon}.png`
  }

  const deliveryItem = (item) => {
    setState((draft) => {
      draft.list = item
    })
    console.log(item, 'hhhhhhhh')
  }

  const butFooter = () => {
    const btns = getTradeAction(information)
    return (
      <View className='trade-item-ft'>
        {btns.map((item, index) => (
          <AtButton
            key={index}
            circle
            className={`btn-${item.btnStatus}`}
            onClick={handleClickItem.bind(this, item)}
          >
            {item.title}
          </AtButton>
        ))}
      </View>
    )
  }

  const handleClickItem = ({ key, action }) => {
    if (key == 'update_delivery') {
      updateDelivery(information)
    } else if (key == 'cancel_delivery') {
      butStatus(information, 'cancel_delivery')
    } else if (key == 'pack') {
      butStatus(information, 'pack')
    } else {
      action(information)
    }
  }

  //更新配送状态
  const updateDelivery = (item) => {
    console.log(item, 'lllupdateDelivery')
    let newList = JSON.parse(JSON.stringify(list))
    newList.push(
      {
        title: $t('75c4fca2.6d9262'),
        selector: '',
        extraText: '',
        status: 'textarea',
        value: 'delivery_remark'
      },
      {
        title: $t('75c4fca2.92d62c'),
        selector: [],
        extraText: '',
        status: 'image',
        value: 'delivery_pics'
      }
    )
    setState((draft) => {
      draft.statusDelivery = true
      draft.list = newList
    })
  }

  const butStatus = (item, val) => {
    if (popUpStatus(item, val)) {
      goodsRef.current.reset()
    }
  }

  const updateDeliverySure = async () => {
    await deliverySure(information, list)
    onClose()
    goodsRef.current.reset()
  }

  const onClose = () => {
    let newList = JSON.parse(JSON.stringify(list)).slice(0, list.length - 2)
    setState((draft) => {
      draft.statusDelivery = false
      draft.list = newList
    })
  }

  return (
    <SpPage
      className={classNames('page-detail')}
      renderFooter={information.orderId && butFooter()}
      ref={pageRef}
    >
      <SpScrollView
        className='scroll-view-goods'
        ref={goodsRef}
        fetch={fetch}
        auto={false}
        renderMore={() => {}}
      >
        {information.orderId && (
          <View>
            <View className='trade-status-desc-box'>
              <SpImage src={getTradeStatusIcon(information)} width={50} height={50} />
              <Text className='status-desc'>{orderState(information)}</Text>
            </View>
            <View className='trade-item-wrap'>
              <CompTradeItem
                info={information}
                updateDelivery={updateDelivery}
                cancelDelivery={(e) => butStatus(e, 'cancelDelivery')}
                pack={(e) => butStatus(e, 'pack')}
                showButton
              />
            </View>
            <View className='trade-item-wrap'>
              <SpCell title={$t('75c4fca2.2240cc')} value={information.createdTime} />
              <SpCell title={$t('75c4fca2.590c95')} value={information.payDate} />
              {information.deliveryTime && (
                <SpCell title={$t('75c4fca2.bfd255')} value={information.deliveryTime} />
              )}
              <SpCell title={$t('75c4fca2.3e8657')} value={information.orderId} />
              <SpCell title={$t('75c4fca2.2caf6a')} value={information.tradeId} />
              {/* <SpCell title='交易流水号' value={information.createTime} /> */}
            </View>
            <View className='trade-item-wrap'>
              <CompShippingInformation
                selector={list}
                delivery={information}
                deliveryItem={deliveryItem}
                showSelect
              />
            </View>
          </View>
        )}
      </SpScrollView>

      <SpFloatLayout
        title={$t('75c4fca2.997b79')}
        open={statusDelivery}
        onClose={onClose}
        renderFooter={
          <AtButton circle type='primary' onClick={updateDeliverySure}>
            {$t('75c4fca2.38cf16')}
          </AtButton>
        }
      >
        {statusDelivery && (
          <CompShippingInformation
            selector={list}
            delivery={information}
            deliveryItem={deliveryItem}
          />
        )}
      </SpFloatLayout>
    </SpPage>
  )
}

Detail.options = {
  addGlobalClass: true
}

export default Detail
