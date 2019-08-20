import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { WgtSearchHome, WgtFilm, WgtMarquees, WgtSlider, WgtImgHotZone, WgtNavigation, WgtCoupon, WgtGoodsScroll, WgtGoodsGrid, WgtShowcase } from '../wgts'

export default class HomeWgts extends PureComponent {
  state = {
    screenWidth: 375
  }

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    wgts: []
  }

  componentDidMount () {
    Taro.getSystemInfo()
      .then(res =>{
        this.setState({
          screenWidth: res.screenWidth
        })
      })
  }

  render () {
    const { wgts, location } = this.props
    const { screenWidth } = this.state

    return (
      <View>
        {
          wgts.map((item, idx) => {
            return (
              <View className='wgt-wrap' key={idx}>
                {item.name === 'search' && <WgtSearchHome withLocation={location} info={item} />}
                {item.name === 'film' && <WgtFilm info={item} />}
                {item.name === 'marquees' && <WgtMarquees info={item} />}
                {item.name === 'slider' && <WgtSlider isHomeSearch info={item} width={screenWidth} />}
                {item.name === 'navigation' && <WgtNavigation info={item} />}
                {item.name === 'coupon' && <WgtCoupon info={item} />}
                {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />}
                {item.name === 'goodsScroll' && <WgtGoodsScroll info={item} />}
                {item.name === 'goodsGrid' && <WgtGoodsGrid info={item} />}
                {item.name === 'showcase' && <WgtShowcase info={item} />}
              </View>
            )
          })
        }
      </View>
    )
  }
}
