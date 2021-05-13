/*
 * @Author: your name
 * @Date: 2021-02-03 17:40:22
 * @LastEditTime: 2021-04-01 09:45:30
 * @LastEditors: PrendsMoi
 * @Description: In User Settings Edit
 * @FilePath: /unite-vshop/src/components/orderItem/order-item.js
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Price, SpImg,PointTag } from '@/components'
import {
  customName
} from '@/utils/point';
import './order-item.scss'

export default class OrderItem extends Component {
  static defaultProps = {
    onClick: () => {},
    payType: '',
    showExtra: true,
    info: null,
    isShowNational: false,
    isPointitemGood:false,
    isShowPointTag:false
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, onClick, isShowPointTag, showExtra,showDesc, customFooter, isShowNational,isPointitemGood } = this.props
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
          {
            isShowPointTag && <PointTag />
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
                isPointitemGood?<Price className='order-item__price' appendText={customName('积分')} noSymbol noDecimal value={info.item_point||info.point}></Price>:<Price className='order-item__price' value={info.price}></Price>
              }
              
              
              {/* {payType=='hfpay'&&<Text className='order-item__pay-type'>微信支付</Text>}
              {payType!='hfpay'&&<Text className='order-item__pay-type'>{payType === 'dhpoint' ? '积分支付' : '微信支付'}</Text>} */}
            </View>
          )
        }
      </View>
    )
  }
}
