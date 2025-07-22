import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { classNames, JumpStoreIndex, JumpGoodDetail } from '@/utils'
import './index.scss'

function SpShopFullReduction(props) {
  const { info, status, count = 0, handeChange, showMoreIcon } = props
  const { promotion_tag, marketing_name } = info
  return (
    <View className={classNames('sp-shop-fullReduction')}>
      <View className='label-style'>{promotion_tag}</View>
      <Text className='text-style'>{marketing_name}</Text>
      {showMoreIcon && (
        <View className='pick-down' onClick={() => handeChange(!status)}>
          {count}种优惠
          <Image
            src='/assets/imgs/down_icon.png'
            className={status ? 'down_icon translate' : 'down_icon'}
          ></Image>
        </View>
      )}
    </View>
  )
}

export default SpShopFullReduction
