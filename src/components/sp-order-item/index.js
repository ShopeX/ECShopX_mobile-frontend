import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpPage, SpPrice, SpImage, SpPoint } from '@/components'
import './index.scss'

function SpOrderItem(props) {
  const {
    payType = '',
    showExtra = true,
    info = null,
    isPointitemGood = false,
    isShowPointTag = false,
    onClick = () => {},
    customFooter,
    showDesc,
    renderDesc,
    renderFooter
  } = props
  const { pointName } = useSelector((state) => state.sys)
  const { priceSetting } = useSelector((state) => state.sys)
  const { order_page } = priceSetting
  const { market_price: enMarketPrice } = order_page

  if (!info) return null

  const showExtraComp = () => {
    if (showExtra) {
      return (
        <View className='sp-order-item__extra'>
          <Text className='sp-order-item__desc'>{info.goods_props}</Text>
          {info.num && <Text className='sp-order-item__num'>数量：{info.num}</Text>}
          {info.item_spec_desc && (
            <Text className='sp-order-item__desc'>{info.item_spec_desc}</Text>
          )}
        </View>
      )
    }
  }

  const img = info.pic_path ? info.pic_path : Array.isArray(info.pics) ? info.pics[0] : info.pics

  console.log('order item info:', info)

  return (
    <View className='sp-order-item' onClick={onClick}>
      <View className='sp-order-item__hd'>
        <SpImage src={img} mode='aspectFill' width={170} height={170} />
      </View>
      <View className='sp-order-item__bd'>
        {/* {isShowPointTag && <SpPoint />} */}
        <View className='sp-order-item__title'>
          {info.order_item_type === 'plus_buy' && (
            <Text className='sp-order-item__title-tag'>换购</Text>
          )}
          {info.order_item_type === 'gift' && (
            <Text className='sp-order-item__title-tag'>赠品</Text>
          )}
          {info.title}
        </View>
        {showDesc && info.item_spec_desc && (
          <Text className='sp-order-item__spec'>{info.item_spec_desc}</Text>
        )}
        {renderDesc}
        {showExtraComp()}
      </View>
      {customFooter ? (
        renderFooter
      ) : (
        <View className='sp-order-item__ft'>
          {isPointitemGood ? (
            <SpPrice
              className='sp-order-item__price'
              appendText={pointName}
              noSymbol
              noDecimal
              value={info.item_point || info.point}
            />
          ) : (
            <View>
              <SpPrice className='sp-order-item__price' value={info.price}></SpPrice>
              {/* {info.market_price > 0 && enMarketPrice && (
                <SpPrice lineThrough value={info.market_price}></SpPrice>
              )} */}
            </View>
          )}
        </View>
      )}
    </View>
  )
}

SpOrderItem.option = {
  addGlobalClass: true
}

export default SpOrderItem

// import React, { Component } from 'react'
// import { View, Text, Image } from '@tarojs/components'
// import { Price, SpImg, PointTag } from '@/components'
// import { connect } from 'react-redux'
// import './index.scss'

// @connect(({ colors, sys }) => ({
//   colors: colors.current,
//   pointName: sys.pointName
// }))
// export default class OrderItem extends Component {
//   static defaultProps = {
//     onClick: () => {},
//     payType: '',
//     showExtra: true,
//     info: null,
//     isShowNational: false,
//     isPointitemGood: false,
//     isShowPointTag: false
//   }

//   static options = {
//     addGlobalClass: true
//   }

//   render () {
//     const {
//       info,
//       onClick,
//       isShowPointTag,
//       showExtra,
//       showDesc,
//       customFooter,
//       isShowNational,
//       isPointitemGood
//     } = this.props
//     if (!info) return null

//     const img = info.pic_path ? info.pic_path : Array.isArray(info.pics) ? info.pics[0] : info.pics

//     return (
//       <View className='order-item' onClick={onClick}>
//         <View className='order-item__hd'>
//           <SpImg img-class='order-item__img' src={img} mode='aspectFill' width='300' lazyLoad />
//         </View>
//         <View className='order-item__bd'>
//           {isShowNational && info.type == '1' && info.origincountry_name && (
//             <View className='nationalInfo'>
//               <Image
//                 className='nationalFlag'
//                 src={info.origincountry_img_url}
//                 mode='aspectFill'
//                 lazyLoad
//               />
//               <Text className='nationalTitle'>{info.origincountry_name}</Text>
//             </View>
//           )}
//           {isShowPointTag && <PointTag />}
//           <View className='order-item__title'>
//             {info.order_item_type === 'plus_buy' && (
//               <Text className='order-item__title-tag'>换购</Text>
//             )}
//             {info.title}
//           </View>
//           {showDesc && info.item_spec_desc && (
//             <Text className='order-item__spec'>{info.item_spec_desc}</Text>
//           )}
//           {this.props.renderDesc}
//           {showExtra && (
//             <View className='order-item__extra'>
//               <Text className='order-item__desc'>{info.goods_props}</Text>
//               {info.num && <Text className='order-item__num'>数量：{info.num}</Text>}
//               {info.item_spec_desc && (
//                 <Text className='order-item__desc'>{info.item_spec_desc}</Text>
//               )}
//             </View>
//           )}
//         </View>
//         {customFooter ? (
//           this.props.renderFooter
//         ) : (
//           <View className='order-item__ft'>
//             {isPointitemGood ? (
//               <Price
//                 className='order-item__price'
//                 appendText={this.props.pointName}
//                 noSymbol
//                 noDecimal
//                 value={info.item_point || info.point}
//               ></Price>
//             ) : (
//               <Price className='order-item__price' value={info.price}></Price>
//             )}
//           </View>
//         )}
//       </View>
//     )
//   }
// }
