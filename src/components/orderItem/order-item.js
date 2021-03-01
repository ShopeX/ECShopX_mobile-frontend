/*
 * @Author: your name
 * @Date: 2021-02-03 17:40:22
 * @LastEditTime: 2021-02-04 16:49:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/components/orderItem/order-item.js
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Price, SpImg } from '@/components'

import './order-item.scss'

export default class OrderItem extends Component {
  static defaultProps = {
    onClick: () => {},
    payType: '',
    showExtra: true,
    info: null,
    isShowNational: false,
    isPointitemGood:false
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, onClick, payType, showExtra,showDesc, customFooter, isShowNational,isPointitemGood } = this.props
    if (!info) return null
    
    const img = info.pic_path
      ? info.pic_path
      : Array.isArray(info.pics)
        ? info.pics[0]
        : info.pics


    return (
      <View
        className='order-item'
        onClick={onClick}
      >
        <View className='order-item__hd'>
          <SpImg
            img-class='order-item__img'
            src={img}
            mode='aspectFill'
            width='300'
            lazyLoad
          />
        </View>
        <View className='order-item__bd'>
          {
            (isShowNational && info.type == '1' && info.origincountry_name) && <View className='nationalInfo'>
                <Image className='nationalFlag' src={info.origincountry_img_url} mode='aspectFill' lazyLoad />
                <Text className='nationalTitle'>
                  { info.origincountry_name }
                </Text>
            </View>
          }            
          <View className='order-item__title'>
            {
              info.order_item_type === 'plus_buy' && (
                <Text className='order-item__title-tag'>换购</Text>
              )
            }
            {info.title}
          </View>
          {showDesc && info.item_spec_desc && <Text className='order-item__spec'>{info.item_spec_desc}</Text>}
          {this.props.renderDesc}
          {showExtra && (
            <View className='order-item__extra'>
              <Text className='order-item__desc'>{info.goods_props}</Text>
              {info.num && <Text className='order-item__num'>数量：{info.num}</Text>}
              {info.item_spec_desc && <Text className='order-item__desc'>{info.item_spec_desc}</Text>}
            </View>
          )}
        </View>
        {customFooter
          ? this.props.renderFooter
          : (
            <View className='order-item__ft'>
              {/* {payType === 'point'
                ? <Price className='order-item__price' appendText='积分' noSymbol noDecimal value={info.point}></Price>
                : <Price className='order-item__price' value={info.price}></Price>
              } */}
              {
                isPointitemGood?<View class="order-item__point">
                  <View class="number">{info.item_point}</View>
                  <View class="text">积分</View>
                </View>:<Price className='order-item__price' value={info.price}></Price>
              }
              
              
              {/* {payType=='hfpay'&&<Text className='order-item__pay-type'>汇付支付</Text>}
              {payType!='hfpay'&&<Text className='order-item__pay-type'>{payType === 'dhpoint' ? '积分支付' : '微信支付'}</Text>} */}
            </View>
          )
        }
      </View>
    )
  }
}
