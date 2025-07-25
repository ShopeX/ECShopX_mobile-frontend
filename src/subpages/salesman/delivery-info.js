import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpPage, SpImage } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { classNames } from '@/utils'
import './delivery-info.scss'

const initialState = {
  packageList: [],
  curIndex: 0,
  deliveryCorpName: '',
  deliveryCode: '',
  deliverPointList: []
}
function TradeDeliveryInfo(props) {
  const [state, setState] = useImmer(initialState)
  const { packageList, curIndex, deliveryCorpName, deliveryCode, deliverPointList } = state
  const router = useRouter()

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { order_id, delivery_id, delivery_corp_name, delivery_code } = router.params
    // 拆单发货
    if (order_id) {
      const { userId } = Taro.getStorageSync('userinfo')
      let params = {
        isSalesmanPage: 1,
        promoter_user_id: userId,
        order_id
      }
      const data = await api.trade.deliveryLists(params)
      setState((draft) => {
        draft.packageList = data.list
        draft.deliveryCorpName = data.list[curIndex]?.delivery_corp_name || '未发货'
        draft.deliveryCode = data.list[curIndex]?.delivery_code || '暂无物流信息'
      })
      getLogisticsInfo(data.list[curIndex]?.delivery_id, 0)
    }

    // 未拆
    if (delivery_id) {
      getLogisticsInfo(delivery_id)
      setState((draft) => {
        draft.deliveryCorpName = delivery_corp_name
        draft.deliveryCode = delivery_code
      })
    }
  }

  const getLogisticsInfo = async (delivery_id, index = 0) => {
    if (delivery_id) {
      const res = await api.trade.deliveryInfoNew({ delivery_id })
      setState((draft) => {
        draft.deliverPointList = res
      })
    } else {
      setState((draft) => {
        draft.deliverPointList = []
      })
    }
  }

  const onChangePackage = ({ delivery_id }, index) => {
    setState((draft) => {
      draft.curIndex = index
      draft.deliveryCorpName = packageList[index]?.delivery_corp_name || '未发货'
      draft.deliveryCode = packageList[index]?.delivery_code || '暂无物流信息'
    })

    getLogisticsInfo(delivery_id)
  }

  const handleCallOpreator = () => {
    Taro.makePhoneCall({
      phoneNumber: selfDeliveryOperatorMobile
    })
  }

  return (
    <SpPage className='page-trade-delivery-info'>
      <ScrollView scrollY className='scroll-view-container'>
        <View className='view-container'>
          {packageList.length > 0 && (
            <View className='block-container'>
              <ScrollView scrollX className='package-scroll'>
                {packageList.map((item, index) => (
                  <View
                    className={classNames('package-item-wrap', {
                      'active': index === curIndex
                    })}
                    onClick={() => onChangePackage(item, index)}
                    key={index}
                  >
                    <View className='package-info-wrap'>
                      <View className='package-info'>
                        <View className='t1'>{`包裹${index + 1}`}</View>
                        <View className='t2'>{`共${item.items.length}件`}</View>
                      </View>
                      {item.items.map((goods, goodsids) => (
                        <SpImage
                          src={goods.pic}
                          key={goodsids}
                          width={80}
                          height={80}
                          circle={8}
                          mode='aspectFit'
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View className='block-container'>
            <View className='corp-name'>{deliveryCorpName}</View>
            <View className='corp-code'>{deliveryCode}</View>
          </View>

          {deliverPointList.length > 0 && (
            <View className='block-container'>
              <View className='deliver-point-list'>
                {deliverPointList.map((item, index) => (
                  <View className='deliver-point-item' key={index}>
                    <View className='point-bg'>
                      <View className='point-fg'></View>
                    </View>
                    <View className='accept-station'>{item.AcceptStation}</View>
                    <View className='accept-time'>{item.AcceptTime}</View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SpPage>
  )
}

TradeDeliveryInfo.options = {
  addGlobalClass: true
}

TradeDeliveryInfo.defaultProps = {}

export default TradeDeliveryInfo
