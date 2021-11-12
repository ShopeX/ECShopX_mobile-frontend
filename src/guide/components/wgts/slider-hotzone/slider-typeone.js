import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'

import '../slider.scss'

export default class SliderTypeOne extends PureComponent {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    autoPlay: true,
    curIdx: 0
  }

  constructor (props) {
    super(props)
    this.state = {
      imgHeight: null
    }
  }
  componentWillMount () {
    const {
      info: { data }
    } = this.props
    Taro.getImageInfo({
      src: data[0].imgUrl
    }).then((res) => {
      let width = res.width
      let height = res.height
      let ratio = width / height
      console.log(
        '(Taro.$systemSize.screenWidth/ratio).toFixed(2)----1',
        (Taro.$systemSize.screenWidth / ratio).toFixed(2)
      )
      let imgHeight = +(Taro.$systemSize.screenWidth / ratio).toFixed(2)
      this.setState({
        imgHeight
      })
    })
  }

  handleClickItem = (item, index) => {
    this.props.onClick(item, index)
  }

  handleSwiperChange = (e) => {
    const { current } = e.detail

    this.props.onChangeSwiper(current)
    // this.setState({
    //   curIdx: current
    // })
  }

  render () {
    const { info, autoPlay, curIdx } = this.props
    const { imgHeight } = this.state

    if (!(info && (imgHeight || info.config.imgHeight))) {
      return null
    }
    const { config, base, data } = info
    let sliderImgHeight = imgHeight || config.imgHeight

    return (
      <View
        className={`slider-wrap ${config.padded ? 'padded' : ''}`}
        style={styleNames({ 'height': `${sliderImgHeight}px` })}
      >
        {/* <Image
          mode='widthFix'
          className={classNames('slider-item__img plus-hidden__img', config.type === 'type2' ? 'type2-img' : config.type === 'type3'?'type3-img':'')}
          src={data[0].imgUrl}

          /> */}
        {/* plus_img */}
        <Swiper
          className='slider-img'
          circular
          autoplay={autoPlay}
          current={curIdx}
          interval={config.interval}
          duration={400}
          onChange={this.handleSwiperChange}
          style={styleNames({ 'height': `${sliderImgHeight}px` })}
        >
          {data.map((item, idx) => {
            return (
              <SwiperItem key='id' className='slider-item'>
                <View style={`padding: 0 ${config.padded ? Taro.pxTransform(20) : 0}`}>
                  <View className={`slider-wrap img-hotzone ${config.padded ? 'padded' : ''}`}>
                    {item.imgUrl && (
                      <Image
                        src={item.imgUrl}
                        mode='widthFix'
                        lazyLoad
                        className={`img-hotzone_img ${config.rounded ? 'rounded' : null}`}
                      />
                    )}

                    {item.hotzoneData.map((h_item, index) => {
                      return (
                        <View
                          key={index}
                          className='img-hotzone_zone'
                          style={`width: ${h_item.widthPer * 100}%; height: ${h_item.heightPer *
                            100}%; top: ${h_item.topPer * 100}%; left: ${h_item.leftPer * 100}%`}
                          onClick={this.handleClickItem.bind(this, h_item, index)}
                        ></View>
                      )
                    })}
                  </View>
                </View>
              </SwiperItem>
            )
          })}
        </Swiper>
      </View>
    )
  }
}
