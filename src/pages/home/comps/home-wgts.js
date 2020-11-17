import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { WgtSearchHome, WgtFilm, WgtMarquees, WgtSlider, WgtImgHotZone, WgtNavigation, WgtCoupon, WgtGoodsScroll, WgtGoodsGridTab, WgtShowcase, WgtStore, WgtHeadline, WgtImgGif,WgtHotTopic,WgtFloorImg} from '../wgts'
import { Tracker } from "@/service";


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
    Taro.getSystemInfo()
      .then(res => {
        this.setState({
          screenWidth: res.screenWidth
        })
        this.startTrack();
      })
  }

  startTrack() {

    this.endTrack();

    const { wgts } = this.props;

    if (!wgts) return;

    const toExpose = wgts.map((t, idx) => String(idx));
    const observer = Taro.createIntersectionObserver(this.$scope, { observeAll: true });

    observer.relativeToViewport({ bottom: 0 }).observe(".wgt-wrap", res => {
      if (res.intersectionRatio > 0) {
        const { name, idx } = res.dataset
        if (name === "goodsGrid") {
          const result = wgts.find((t, index) => index == idx);
          if (result) {
            result.data.forEach(goods => {
              Tracker.dispatch("EXPOSE_SKU_COMPONENT", goods);
            })
          }
        }
      }
    });

    this.observe = observer;
  }

  endTrack() {
    if (this.observer) {
      this.observer.disconnect();
      this.observe = null;
    }
  }

  render() {
    const { wgts } = this.props
    const { screenWidth } = this.state
    console.log('wgts------->',wgts)

    return (
      <View>
        {
          wgts.map((item, idx) => {
            return (
              <View className='wgt-wrap' key={`${item.name}${idx}`} data-idx={idx} data-name={item.name}>
                {item.name === 'search' && <WgtSearchHome info={item} />}
                {item.name === 'film' && <WgtFilm info={item} />}
                {item.name === 'marquees' && <WgtMarquees info={item} />}
                {item.name === 'slider' && <WgtSlider isHomeSearch info={item} width={screenWidth} />}
                {item.name === 'navigation' && <WgtNavigation info={item} />}
                {item.name === 'coupon' && <WgtCoupon info={item} />}
                {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />}
                {item.name === 'goodsScroll' && <WgtGoodsScroll info={item} />}
                {item.name === 'goodsGrid' && <WgtGoodsGridTab info={item} />}
                {item.name === 'showcase' && <WgtShowcase info={item} />}
                {item.name === 'headline' && <WgtHeadline info={item}/>}
                {item.name === 'img-gif' && <WgtImgGif info={item}/>}
                {item.name === 'hotTopic' && <WgtHotTopic info={item}/>}
                {item.name === 'floorImg-two' && <WgtFloorImg info={item}/>}
                {item.name === 'floorImg' && <WgtFloorImg info={item}/>}
                {APP_PLATFORM !== 'standard' && item.name === 'store' && <WgtStore info={item} />}
              </View>
            )
          })
        }
      </View>
    )
  }
}
