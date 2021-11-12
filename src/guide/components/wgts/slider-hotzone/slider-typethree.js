import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { styleNames } from '@/utils'

import '../slider.scss'

export default class SliderTypeThree extends PureComponent {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    autoPlay: true,
    curIdx: 0
  }

  constructor(props) {
    super(props)
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

  render() {
    const { info, curIdx } = this.props

    if (!info) {
      return null
    }

    const { config, data } = info

    return (
      <View className='sliderimgflex'>
        <Image
          mode='heightFix'
          className='left-fixed__img'
          src={config.leftfiximgUrl}
          style={styleNames({ 'height': config.height + 'rpx' })}
        />

        <Swiper
          className='slider-img type3-right-swiper'
          circular={false}
          displayMultipleItems={2}
          current={curIdx}
          interval={config.interval}
          duration={300}
          onChange={this.handleSwiperChange}
          nextMargin='20px'
          style={styleNames({ 'height': config.height + 'rpx' })}
        >
          {data.map((item, idx) => {
            return (
              <SwiperItem key='id' className={`slider-item ${config.rounded ? 'rounded' : null}`}>
                <View style={styleNames({ 'height': '100%' })}>
                  {item.imgUrl && (
                    <Image
                      src={item.imgUrl}
                      mode='widthFix'
                      className={`type_img left-item__img  ${config.rounded ? 'rounded' : null}`}
                    />
                  )}

                  {item.hotzoneData.map((h_item, index) => {
                    return (
                      <View
                        key={index}
                        className='type_img left-item__img'
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
      </View>
    )
  }
}
