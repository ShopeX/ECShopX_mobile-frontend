import React, { PureComponent } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import { connect } from 'react-redux'
import api from '@/api'
import S from '@/spx'
import { linkPage } from '../helper'
import SliderTypeOne from './slider-typeone'
import SliderTypeTwo from './slider-typetwo'
import SliderTypeThree from './slider-typethree'

import '../slider.scss'

@connect(
  ({}) => ({}),
  (dispatch) => ({
    onCloseCart: (item) => dispatch({ type: 'cart/closeCart', payload: item }),
    onSetGoodsSkuInfo: (item) => dispatch({ type: 'cart/setGoodsSkuInfo', payload: item })
  })
)
export default class WgtSliderHotzone extends PureComponent {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      curIdx: 0,
      progesswidth: 0,
      percentage: 0
    }
  }

  handleClickItem = async (item, index) => {
    if (item.linkPage == 'addCart') {
      this.onClickAddCart(item.id)
      return
    }

    if (item.linkPage === 'cashcoupon') {
      const toke = S.getAuthToken()
      if (!toke) {
        S.login(this)
      } else {
        api.member.sendCashCoupon({ stock_id: item.id }).then((res) => {
          S.toast(res.msg)
        })
      }
      return
    }

    linkPage(item.linkPage, item.id, item)
  }
  onClickAddCart = async (id) => {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再购买',
        icon: 'none'
      })

      setTimeout(() => {
        S.login(this)
      }, 50)

      return
    }
    const { onSetGoodsSkuInfo, onCloseCart } = this.props
    try {
      const skuinfo = await api.item.detail(id)
      setTimeout(() => {
        onCloseCart(true)
        onSetGoodsSkuInfo(skuinfo)
      }, 10)
    } catch (e) {}
  }
  handleChange = (index) => {
    this.setState({
      curIdx: index
    })
  }
  changeCurrentIndex = (index) => {
    this.setState({
      curIdx: index
    })
  }

  // handleSwiperChange = (e) => {
  //     const { current } = e.detail

  //     this.setState({
  //         curIdx: current
  //     })
  // }

  render() {
    const { info, autoPlay } = this.props
    const { curIdx, percentage, progesswidth } = this.state

    if (!info) {
      return null
    }

    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content

    return (
      <View>
        {config ? (
          <View
            style={styleNames({
              'position': 'relative',
              'top': `${Number(config.top) ? -Number(config.top) : 0}px`
            })}
          >
            <View
              className={`wgt ${base.padded ? 'wgt__padded' : null} slidepostion`}
              style={styleNames({
                'background-image': 'url(' + config.bgimgUrl + ')',
                'background-size': 'contain',
                'padding': `${
                  config.bgpadding
                    ? `${config.bgpadding.toppadding || 0}px ${config.bgpadding.rightpadding ||
                        0}px ${config.bgpadding.bottompadding || 0}px ${config.bgpadding
                        .leftpadding || 0}px`
                    : '0px'
                }`
              })}
            >
              {base.title && (
                <View className='wgt__header'>
                  <View className='wgt__title'>{base.title}</View>
                  <View className='wgt__subtitle'>{base.subtitle}</View>
                  <Text
                    className={classNames(
                      'wgt__header__more',
                      Taro.$system === 'iOS' ? 'wgt__header__iosmore' : ''
                    )}
                  >
                    {' '}
                    >{' '}
                  </Text>
                </View>
              )}
              {config.type == 'type4' && (
                <View className='slider-title'>
                  {data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <View
                          key='index'
                          className='slider-title__text'
                          style={styleNames({
                            'background-color': curIdx == index ? config.contentBgColor : '#F9F9F8',
                            'color': curIdx == index ? '#ffffff' : '#999999'
                          })}
                          onClick={() => this.changeCurrentIndex(index)}
                        >
                          {item.content || '未定义标题'}
                        </View>
                      )
                    })}
                </View>
              )}

              {config && (config.type == 'type1' || config.type == 'type4' || !config.type) && (
                <SliderTypeOne
                  info={info}
                  autoPlay={autoPlay}
                  curIdx={curIdx}
                  onClick={this.handleClickItem}
                  onChangeSwiper={this.handleChange}
                />
              )}
              {config && config.type == 'type2' && (
                <SliderTypeTwo
                  info={info}
                  autoPlay={autoPlay}
                  curIdx={curIdx}
                  onClick={this.handleClickItem}
                  onChangeSwiper={this.handleChange}
                />
              )}
              {config && config.type == 'type3' && (
                <SliderTypeThree
                  info={info}
                  autoPlay={autoPlay}
                  curIdx={curIdx}
                  onClick={this.handleClickItem}
                  onChangeSwiper={this.handleChange}
                />
              )}

              {data.length > 1 && config.dot && config.shape !== 'progressbar' && (
                <View
                  className={classNames(
                    'slider-dot',
                    { 'dot-size-switch': config.animation },
                    config.dotLocation,
                    config.dotCover ? 'cover' : 'no-cover',
                    config.shape
                  )}
                >
                  {data.map((dot, dotIdx) => (
                    <View
                      className={classNames('dot', { active: curIdx === dotIdx })}
                      style={styleNames({
                        'background-color':
                          curIdx === dotIdx ? config.activedotColor : config.dotColor
                      })}
                      key='id'
                    >
                      {' '}
                    </View>
                  ))}
                </View>
              )}

              {data.length > 1 && !config.dot && config.shape !== 'progressbar' && (
                <View
                  className={classNames(
                    'slider-count',
                    config.dotLocation,
                    config.shape,
                    config.dotColor
                  )}
                >
                  <View
                    className='count'
                    style={styleNames({ 'background-color': config.dotColor })}
                  >
                    {curIdx + 1}/{data.length}
                  </View>
                </View>
              )}
              {data.length > 1 &&
                config.dot &&
                config.shape === 'progressbar' &&
                config.type == 'type2' && (
                  <View className={classNames('slider-dot', config.dotLocation, config.shape)}>
                    <View
                      className='slider-progressbar'
                      style={`width:${progesswidth}rpx;background-color:${config.dotColor}`}
                    >
                      <View
                        className='bar'
                        style={styleNames({
                          'background-color': config.activedotColor,
                          'left': `${progesswidth * percentage}rpx`
                        })}
                      ></View>
                    </View>
                  </View>
                )}

              {config.content && data.length > 0 && curContent && config.type !== 'type4' && (
                <Text className='slider-caption'>{curContent}</Text>
              )}
            </View>
          </View>
        ) : null}
      </View>
    )
  }
}
