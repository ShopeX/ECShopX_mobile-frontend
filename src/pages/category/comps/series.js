import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { Loading } from '@/components'
import { classNames } from '@/utils'

import './series.scss'

@connect(({ store, colors }) => ({
  store,
  colors: colors.current
}))
export default class Series extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    pluralType: true,
    imgType: true
  }

  constructor(props) {
    super(props)

    this.state = {
      currentIndex: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isChanged === true) {
      this.setState({
        currentIndex: 0
      })
    }
  }

  handleClickCategoryNav = (gIndex) => {
    this.setState({
      currentIndex: gIndex
    })
  }

  handleClickItem = (item) => {
    const { category_id, main_category_id } = item
    let url = ''
    if (category_id) {
      url = `/pages/item/list?cat_id=${category_id || ''}`
    }
    if (main_category_id) {
      url = `/pages/item/list?main_cat_id=${main_category_id || ''}`
    }
    if (url) {
      Taro.navigateTo({
        url
      })
    }
  }

  handleCustomClick = (id) => {
    if (id) {
      Taro.navigateTo({
        url: `/pages/custom/custom-page?id=${id}`
      })
    }
  }

  render() {
    const { info, isChanged, pluralType, imgType, colors } = this.props
    const { currentIndex } = this.state
    if (!info) {
      return <Loading />
    }
    const items = info[currentIndex].children
    const id = info[currentIndex].id || ''
    const itemsImg = info[currentIndex].img

    return (
      <View className='category-list'>
        <ScrollView className='category-list__nav' scrollY>
          <View className='category-nav'>
            {info.map((item, index) => (
              <View
                className={classNames(
                  'category-nav__content',
                  currentIndex == index ? 'category-nav__content-checked' : null
                )}
                style={
                  currentIndex == index
                    ? `border-left: 7rpx solid ${colors.data[0].primary};`
                    : null
                }
                key={`${item.name}${index}`}
                onClick={this.handleClickCategoryNav.bind(this, index)}
              >
                {item.hot && <Text className='hot-tag'></Text>}
                {item.name}
              </View>
            ))}
          </View>
        </ScrollView>
        {/*右*/}
        <ScrollView className='category-list__content' scrollY>
          <View className={classNames(pluralType ? 'category-content' : 'category-content-no')}>
            {itemsImg && (
              <Image
                src={itemsImg}
                mode='aspectFill'
                onClick={this.handleCustomClick.bind(this, id)}
                className='category__banner'
              />
            )}
            {items.map((item) =>
              item.children ? (
                <View className='new'>
                  <View className='group-title'>{item.name}</View>
                  <View className='content-group'>
                    {item.children.map((child) => (
                      <View
                        className='category-content__img'
                        key={child.category_id}
                        onClick={this.handleClickItem.bind(this, child)}
                      >
                        {child.img && (
                          <Image
                            className={classNames(imgType ? 'cat-img' : 'cat-img-no')}
                            mode='aspectFit'
                            src={child.img}
                          />
                        )}
                        <View className='img-cat-name'>{child.name}</View>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View
                  className='category-content__img'
                  key={item.category_id}
                  onClick={this.handleClickItem.bind(this, item)}
                >
                  {item.img && (
                    <Image
                      className={classNames(imgType ? 'cat-img' : 'cat-img-no')}
                      mode='aspectFit'
                      src={item.img}
                    />
                  )}
                  <View className='img-cat-name'>{item.name}</View>
                </View>
              )
            )}

            <View className='category-content__img-empty'> </View>
            <View className='category-content__img-empty'> </View>
            <View className='category-content__img-empty'> </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
