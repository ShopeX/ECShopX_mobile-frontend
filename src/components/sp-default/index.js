import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import SpImage from './../sp-image'

import './index.scss'

const TYPES = {
  cart: 'empty_cart.png'
}

function SpDefault() {
  const { className, message, children, type } = this.props
  return (
    <View
      className={classNames(
        {
          'sp-default': true
        },
        className
      )}
    >
      <View className='sp-default-hd'>
        {type && <SpImage className='default-img' src={TYPES[type]} />}
      </View>
      <View className='sp-default-bd'>{message}</View>
      <View className='sp-default-ft'>{children}</View>
    </View>
  )
}

export default SpDefault

// export default class SpDefault extends Component {
//   static options = {
//     addGlobalClass: true
//   };

//   defaultProps = {
//     icon: false,
//     message: ''
//   }

//   render() {
//     const { icon, message, children, className, isUrl } = this.props;

//     return (
//       <View className={classNames("sp-default", className)}>
//         {icon && (
//           <Image
//             className="sp-default-img"
//             mode="widthFix"
//             src={`/assets/imgs/cart_empty.png`}
//           />
//         )}
//         <View className="sp-default-text">{message}</View>
//         <View className="sp-default-btns">{children}</View>
//       </View>
//     );
//   }
// }
