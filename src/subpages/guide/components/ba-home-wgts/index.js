import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {
  WgtFilm,
  WgtSlider,
  WgtImgHotZone,
  WgtNavigation,
  WgtCoupon,
  WgtGoodsScroll,
  WgtGoodsGrid,
  WgtShowcase,
  WgtPointLuck,
  WgtTagNavigation,
  WgtSliderHotzone,
  WgtActivityZone,
  WgtSearchHome
} from '../wgts'
// import {  WgtSearchHome } from '@/pages/home/wgts'

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

  render() {
    const { wgts, scrollTop, source, zz } = this.props
    const { screenWidth } = this.state
    return (
      <View>
        {wgts.map((item, idx) => {
          return (
            <View className='wgt-wrap' key='indx'>
              {item.name === 'slider' && (
                <WgtSlider
                  source={source}
                  componentIndex={idx}
                  isHomeSearch
                  info={item}
                  width={screenWidth}
                  scrollTop={scrollTop}
                />
              )}
              {item.name === 'search' && (
                <WgtSearchHome info={item} dis_id={getCurrentInstance().router.params.id} />
              )}
              {item.name === 'slider-hotzone' && (
                <WgtSliderHotzone source={source} componentIndex={idx} info={item} />
              )}
              {item.name === 'film' && <WgtFilm source={source} componentIndex={idx} info={item} />}
              {item.name === 'navigation' && (
                <WgtNavigation source={source} componentIndex={idx} info={item} />
              )}
              {/* {item.name === 'coupon' && <WgtCoupon source={source} componentIndex={idx}  info={item} />} */}
              {item.name === 'imgHotzone' && (
                <WgtImgHotZone source={source} componentIndex={idx} info={item} />
              )}
              {item.name === 'goodsScroll' && (
                <WgtGoodsScroll source={source} componentIndex={idx} info={item} />
              )}
              {item.name === 'goodsGrid' && (
                <WgtGoodsGrid source={source} componentIndex={idx} info={item} />
              )}
              {item.name === 'showcase' && (
                <WgtShowcase source={source} componentIndex={idx} info={item} />
              )}
              {item.name === 'tagNavigation' && (
                <View id={`tag-hotzone_img${item.tagnavIndex}`}>
                  <WgtTagNavigation
                    source={source}
                    componentIndex={idx}
                    info={item}
                    onClick={this.handleTagNavationTop}
                  />
                </View>
              )}
              {/* {item.name === 'activityZone' && <WgtActivityZone source={source} componentIndex={idx} info={item} /> } */}

              {idx === 1 && <WgtPointLuck />}
            </View>
          )
        })}
      </View>
    )
  }
}
