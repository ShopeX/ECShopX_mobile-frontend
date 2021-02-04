import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { copyText } from '@/utils'
import InputNumber from '@/components/input-number'
import SpCheckbox from '@/components/checkbox'
import OrderItem from  '../../../../components/orderItem/order-item'


import './detail-item.scss'

export default class AfterDetailItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    // customHeader: false
    customFooter: false,
    showType: 'orders'
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

  // handleClickAfterSale= (item) => {
  //   const { info: { tid: order_id, is_all_delivery, delivery_status } } = this.props
  //   if (!item.aftersales_status || item.aftersales_status === 'SELLER_REFUSE_BUYER') {
  //     Taro.navigateTo({
  //       url: `/subpage/pages/trade/refund?order_id=${order_id}&item_id=${item.item_id}&isDelivery=${is_all_delivery}&delivery_status=${delivery_status}`
  //     })
  //   } else {
  //     Taro.navigateTo({
  //       url: `/subpage/pages/trade/refund-detail?order_id=${order_id}&item_id=${item.item_id}&isDelivery=${is_all_delivery}&delivery_status=${delivery_status}`
  //     })
  //   }
  // }
    handleLookDelivery = (value) => {
      if(value.delivery_type=='new'){
        Taro.navigateTo({
          url: `/subpage/pages/trade/split-bagpack?order_type=${this.props.info.order_type}&order_id=${this.props.info.tid}&delivery_code=${value.delivery_code}&delivery_corp=${value.delivery_corp}&delivery_name=${value.delivery_name}`
        })
      }else{
        Taro.navigateTo({
          url: `/subpage/pages/trade/delivery-info?order_type=${this.props.info.order_type}&order_id=${this.props.info.tid}&delivery_code=${value.delivery_code}&delivery_corp=${value.delivery_corp}&delivery_name=${value.delivery_name}`
        })
      }
    
  }
  handleCodeCopy = (val) => {
    copyText(val)
    S.toast('复制成功')
  }
  handleSelectionChange (item_id, checked) {//选择要申请售后的商品
    const { info, showType,onCheckChange } = this.props
    // info[showType].map(item=>{
    //   item.item_id == item_id && (item.is_checked = checked);
    //   if(item.is_checked){
        
    //   }
    // })
    // this.setState({
    //   info
    // })
    if(onCheckChange){
      onCheckChange(item_id,checked)
    }
  }
  handleQuantityChange(item,val){   //改变售后商品的数量 
    const { info, showType,onInputNumberChange } = this.props 
    // info[showType].map(v=>{
    //   v.item_id == item.item_id && (v.apply_num = val)
    // })
    // this.setState({
    //   info
    // })
    if(onInputNumberChange){
      onInputNumberChange(item,val)
    }
  }

  render () {
    const { customHeader, customFooter, noHeader, onClick, info, showActions, showType } = this.props;

    console.log("-----props-----")
    console.log(info) 

    return (
      <View className='detail-item'>
        {
          info && info[showType] && info[showType].map((item, idx) =>
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
            <View className="order-flex">
                <View className="order-flex_checkbox">
                    {
                      item.left_aftersales_num > 0 
                      ?  <SpCheckbox
                        key={item.item_id}
                        checked={item.is_checked}
                        onChange={this.handleSelectionChange.bind(this, item.item_id)}
                      />
                    : null
                    }
                </View>

            
              <View className="order-flex_goods">
                <OrderItem
                  key={`${idx}1`}
                  info={item}
                  isShowNational
                />
              </View>
            </View>  

              {
                !customFooter && info.pay_type !== 'dhpoint' && (info.status === 'TRADE_SUCCESS' || info.status === 'WAIT_BUYER_CONFIRM_GOODS' || info.status === 'WAIT_SELLER_SEND_GOODS') && <View className='order-item__ft'>
                 {
                    info.delivery_type=='old'&&(info.delivery_code
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
                      </AtButton> )                  
                  }
                  {
                    item.left_aftersales_num && <InputNumber
                      min={1}
                      max={item.left_aftersales_num}
                      value={item.apply_num}
                    // onChange={this.props.onNumChange}
                      onChange={this.handleQuantityChange.bind(this,item)}
                    />
                  }
                </View>
              }
            </View>

          )
        }
      </View>
    )
  }
}
