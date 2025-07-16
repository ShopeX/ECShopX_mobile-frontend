import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpSearch } from '@/components'
import {
  WgtSlider,
  WgtImgHotZone,
  WgtGoodsScroll,
  WgtGoodsGrid,
} from '../wgts'
// import {  WgtSearchHome } from '@/pages/home/wgts'

export default class HomeWgts extends Component {
  state = {
    screenWidth: 375
  }
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    wgts: []
  }

  componentDidMount() {
    Taro.getSystemInfo().then((res) => {
      this.setState({
        screenWidth: res.screenWidth
      })
    })
  }
  handleTagNavationTop = (index) => {
    let _this = this

    const query = Taro.createSelectorQuery().in(this.$scope)
    let eleName = `#tag-hotzone_img${index}`
    console.log('eleName----999', eleName)
    query.select(eleName).boundingClientRect()
    query.exec(function (res) {
      const { onChangPageScroll } = _this.props
      onChangPageScroll(res[0].top)
    })
  }

  searchMethod = () => {
    Taro.navigateTo({
      url: `/subpages/guide/item/list`
    })
  }

  render() {
    const { wgts, scrollTop, source, zz } = this.props
    const { screenWidth } = this.state
    return (
      <View>
        {wgts.map((item, idx) => {
          return (
            <View className='wgt-wrap' key='indx'>
              {item.name === 'search' && <SpSearch info={item} onClick={this.searchMethod} />}{' '}
              {item.name === 'slider' && <WgtSlider isHomeSearch info={item} />} {/** 轮播 */}
              {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />} {/** 热区图 */}
              {/** 商品滚动 */}
              {item.name === 'goodsScroll' && <WgtGoodsScroll info={item} index={idx} type='good-scroll' />}
              {/** 商品栅格 */}
              {item.name === 'goodsGrid' && <WgtGoodsGrid info={item} index={idx} type='good-grid' />}
            </View>
          )
        })}
      </View>
    )
  }
}
