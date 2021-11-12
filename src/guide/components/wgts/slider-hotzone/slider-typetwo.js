import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { styleNames } from '@/utils'
import '../slider.scss'

export default class SliderTypeTwo extends PureComponent {
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
  }

  handleClickItem = (item, index) => {
    this.props.onClick(item, index)
  }

  handleSwiperChange = (e) => {
    const { current } = e.detail
    this.props.onChangeSwiper(current)
  }

  render () {
    const { info, curIdx } = this.props
    if (!info) {
      return null
    }

    const { config, data } = info

    return (
      <Swiper
        className='slider-img'
        circular={false}
        displayMultipleItems={config.swiperOption.slidesPerView || 1.1}
        current={curIdx}
        interval={config.interval}
        duration={500}
        onChange={this.handleSwiperChange}
        previousMargin='15px'
        style={styleNames({ 'height': config.height + 'px' })}
      >
        {data.map((item, idx) => {
          return (
            <SwiperItem key='id' className='slider-item'>
              <View className={`slider-item__marginleft img-hotzone `}>
                {item.imgUrl && (
                  <Image
                    src={item.imgUrl}
                    mode='widthFix'
                    className={`slider-item__img img-hotzone_img ${
                      config.rounded ? 'rounded' : null
                    }`}
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
            </SwiperItem>
          )
        })}
      </Swiper>
    )
  }
}
