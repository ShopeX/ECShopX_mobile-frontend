import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'

import './store-info.scss';

export default class StoreInfo extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      isFav: false
    }
  }

  componentDidMount() {
    const { info } = this.props
    api.member.storeIsFav(info.distributor_id).then(res => {
      if (res) {
        this.setState({
          isFav: true
        })
      }
    })
  }

  handleClickLink = () => {
    Taro.navigateTo({
      url: '/pages/store/index'
    })
  }

  handleStoreFav = async (id) => {
    const { isFav } = this.state
    if (isFav) return
    
    const { fav_id } = await api.member.storeFav(id)
    if (fav_id) {
      this.setState({
        isFav: true
      })
    }
  }

  render () {
    const { info } = this.props
    const { isFav } = this.state

    if (!info) {
      return null
    }

    return (
      <View className='goods-sec-specs store-info'>
        <View className="view-flex view-flex-middle">
          <Image className="store-brand" src={info.imgUrl || 'https://fakeimg.pl/120x120/EFEFEF/CCC/?text=brand&font=lobster'} mode="aspectFit" />
          <View>
            <View className="store-name">{info.name}</View>
          </View>
        </View>
        <View className='view-flex'>
          <View className='view-flex-item'>
            <View
              className="store-attention-btn"
              onClick={this.handleStoreFav.bind(this, info.distributor_id)}
            >
              {isFav ? '已关注' : '关注店铺'}
            </View>
          </View>
          <View className='view-flex-item'>
            <View
              className="store-enter-btn"
              onClick={this.handleClickLink}
            >进入店铺</View>
          </View>
        </View>
      </View>
    )
  }
}
