import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { SpCell } from '@/components'
import api from '@/api'

import './shop-setting.scss'

export default class DistributionShopSetting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentDidShow() {
    this.fetch()
  }

  async fetch() {
    const res = await api.distribution.info()
    const { shop_name, brief, shop_pic } = res

    this.setState({
      info: {
        shop_name,
        brief,
        shop_pic
      }
    })
  }

  handleClick = (key) => {
    const { info } = this.state

    Taro.navigateTo({
      url: `/marketing/pages/distribution/shop-form?key=${key}&val=${info[key] || ''}`
    })
  }

  render() {
    const { info } = this.state

    return (
      <View className='page-distribution-shop-setting'>
        <SpCell
          title='小店名称'
          value={info.shop_name}
          onClick={this.handleClick.bind(this, 'shop_name')}
          border
          isLink
        />
        <SpCell
          title='小店描述'
          value={info.brief}
          onClick={this.handleClick.bind(this, 'brief')}
          border
          isLink
        />
        <SpCell title='小店店招' onClick={this.handleClick.bind(this, 'shop_pic')} isLink>
          <Image
            className='shop-sign'
            src={info.shop_pic || 'https://fakeimg.pl/320x100/EFEFEF/CCC/?font=lobster'}
            mode='widthFix'
          />
        </SpCell>
      </View>
    )
  }
}
