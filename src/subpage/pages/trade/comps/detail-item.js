import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { copyText } from '@/utils'
import OrderItem from  '../../../../components/orderItem/order-item'
import InputNumber from '@/components/input-number'

import './detail-item.scss'

export default class DetailItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    // customHeader: false
    customFooter: false,
    // customRender: false,
    // noHeader: false,
    // showActions: false,
    // payType: '',
    // onClickBtn: () => {},
    // onClick: () => {}
  }

  // handleClickBtn (type) {
  //   const { info } = this.props
  //   this.props.onClickBtn && this.props.onClickBtn(type, info)
  // }

  handleClickAfterSale= (item) => {
    const { info: { tid: order_id } } = this.props
    if (!item.aftersales_status || item.aftersales_status === 'SELLER_REFUSE_BUYER') {
      Taro.navigateTo({
        url: `/subpage/pages/trade/refund?order_id=${order_id}&item_id=${item.item_id}`
      })
    } else {
      Taro.navigateTo({
        url: `/subpage/pages/trade/refund-detail?order_id=${order_id}&item_id=${item.item_id}`
      })
    }
  }
    handleLookDelivery = (value) => {
    Taro.navigateTo({
      url: `/subpage/pages/trade/delivery-info?order_type=${this.props.info.order_type}&order_id=${this.props.info.tid}&delivery_code=${value.delivery_code}&delivery_corp=${value.delivery_corp}&delivery_name=${value.delivery_name}`
    })
  }
  handleCodeCopy = (val) => {
    copyText(val)
    S.toast('复制成功')
  }

  render () {
    const { customHeader, customFooter, noHeader, onClick, info, showActions } = this.props
    console.log('detail-info---======>',info)
    return (
      <View className='detail-item'>
        {
          info && info.orders.map((item, idx) =>
            <View className='detail-item-good' key={`${idx}1`}>
            <View className='detail-item__fix'>
                <Text className='detail-item__title'>第{idx+1}件商品</Text>
                {
                  info.delivery_code
                  ? null
                  : item.delivery_code
                    ? <View className='detail-item__code'>
                        <Text className='code'>物流单号：{item.delivery_code}</Text>
                        <Text className='btn' onClick={this.handleCodeCopy.bind(this, item.delivery_code)}>复制</Text>
                      </View>
                    : null
                }               
            </View>  
              <OrderItem
                key={`${idx}1`}
                info={item}
                isShowNational
              />
              {
                !customFooter && info.pay_type !== 'dhpoint' && (info.status === 'TRADE_SUCCESS' || info.status === 'WAIT_BUYER_CONFIRM_GOODS' || info.status === 'WAIT_SELLER_SEND_GOODS') && <View className='order-item__ft'>
                 {
                    info.delivery_code
                    ? null
                    : item.delivery_code && 
                    <AtButton
                        circle
                        type='text'
                        size='small'
                        className='delivery-btn'                        
                        onClick={this.handleLookDelivery.bind(this, item)}
                      >
                       查看物流
                      </AtButton>                   
                  }
                  {
                    (info.status !== 'WAIT_SELLER_SEND_GOODS' && info.latest_aftersale_time >= 0 &&item.aftersales_status !== 'CLOSED')  &&
                      <AtButton
                        circle
                        type='primary'
                        size='small'
                        onClick={this.handleClickAfterSale.bind(this, item)}
                      >
                        {
                          (!item.aftersales_status || item.aftersales_status === 'SELLER_REFUSE_BUYER') ? '申请售后' : '售后详情'
                        }
                      </AtButton>
                  }
                  <InputNumber
                    min={1}
                    max={item.num}
                    value={item.num}
                    onChange={this.props.onNumChange}
                  />
                </View>
              }
            </View>

          )
        }
      </View>
    )
  }
}
