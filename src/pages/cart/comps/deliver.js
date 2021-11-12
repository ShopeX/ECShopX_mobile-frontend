import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AddressChoose } from '@/components'

import './deliver.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class Deliver extends Component {
  static defaultProps = {
    list: [],
    curStore: {},
    address: {},
    isOpenStore: false,
    receiptType: ''
  }

  static options = {
    addGlobalClass: true
  }

  // 切换配送方式
  handleSwitchExpress = (type) => {
    const { receiptType } = this.props
    if (receiptType === type) return false
    this.props.onChangReceiptType && this.props.onChangReceiptType(type)
  }

  // 切换自提店铺
  handleEditZitiClick = (id) => {
    this.props.onEidtZiti && this.props.onEidtZiti(id)
  }

  handleMapClick = () => {
    const { curStore } = this.state
    const { lat, lng } = curStore ? curStore : Taro.getStorageSync('curStore')
    Taro.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      scale: 18
    })
  }

  // 自定义选择店铺跳转事件
  handleChooseAddress = (choose) => {
    const { receiptType, curStore } = this.props
    let params = ''
    if (receiptType === 'dada') {
      params = `&city=${curStore.city}&receipt_type=${receiptType}`
    }
    Taro.navigateTo({
      url: `/marketing/pages/member/address?isPicker=${choose}${params}`
    })
  }

  render() {
    const { curStore, receiptType, address, isOpenStore, colors } = this.props
    const { goodType, type } = this.$router.params
    // 收货方式[快递，同城，自提]
    const deliveryList = [
      {
        type: 'logistics',
        name: '普通快递',
        isopen:
          curStore.is_delivery ||
          (!curStore.is_delivery && !curStore.is_ziti) ||
          goodType === 'cross'
      },
      {
        type: 'dada',
        name: '同城配送',
        isopen: curStore.is_dada && goodType !== 'cross'
      },
      {
        type: 'ziti',
        name: '自提',
        isopen: type !== 'pointitem' && goodType !== 'cross' && curStore.is_ziti
      }
    ]
    const showSwitchDeliver = deliveryList.filter((item) => item.isopen)

    return (
      <View className='deliver'>
        {showSwitchDeliver && showSwitchDeliver.length > 1 && (
          <View className='switch-tab'>
            {showSwitchDeliver.map((item) => (
              <View
                key={item.type}
                style={`background: ${
                  receiptType === item.type ? colors.data[0].primary : 'inherit'
                }`}
                className={`switch-item ${receiptType === item.type ? 'active' : ''}`}
                onClick={this.handleSwitchExpress.bind(this, item.type)}
              >
                {item.name}
              </View>
            ))}
          </View>
        )}
        {receiptType === 'logistics' && <AddressChoose isAddress={address} />}
        {receiptType === 'ziti' && (
          <View className='address-module'>
            <View className='addr-title'>{curStore.name}</View>
            <View className='addr-detail'>
              <View className='address'>{curStore.store_address}</View>
              {isOpenStore && process.env.APP_PLATFORM === 'standard' ? (
                <View
                  className='iconfont icon-edit'
                  onClick={this.handleEditZitiClick.bind(this, curStore.distributor_id)}
                ></View>
              ) : (
                <View
                  className='iconfont icon-periscope'
                  onClick={this.handleMapClick.bind(this)}
                ></View>
              )}
            </View>
            <View className='otherInfo'>
              <View className='text-muted light'>门店营业时间：{curStore.hour}</View>
              <View className='text-muted'>
                联系电话：<Text className='phone'>{curStore.phone}</Text>
              </View>
            </View>
          </View>
        )}
        {receiptType === 'dada' && (
          <View className='cityDeliver'>
            <AddressChoose
              isAddress={address}
              onCustomChosse={this.handleChooseAddress.bind(this)}
            />
            <View className='store'>配送门店: {curStore.name}</View>
          </View>
        )}
      </View>
    )
  }
}
