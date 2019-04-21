import Taro, { Component } from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import { connect } from "@tarojs/redux";
import { Loading, SearchBar, TabBar } from '@/components'
import { classNames, pickBy } from '@/utils'
import api from '@/api'

import './series.scss'
import {AtTabs, AtTabsPane} from "taro-ui";
@connect(store => ({
  store
}))
export default class Series extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: null,
      pluralType: true,
      imgType: true,
      currentIndex: 0,
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const res = await api.category.get()
    const nList = pickBy(res, {
      category_name: 'category_name',
      image_url: 'image_url',
      children: 'children'
    })
    this.setState({
      list: nList
    })
  }

  handleClickCategoryNav = (gIndex) => {
    this.setState({
      currentIndex: gIndex
    })
  }

  handleClickItem (item) {
    const { category_id } = item
    const url = `/pages/item/list?cat_id=${category_id}`

    Taro.navigateTo({
      url
    })
  }

  render () {
    const { list, pluralType, imgType, currentIndex } = this.state
    let items
    if(list) {
      items = list[currentIndex].children
    }
    if (!list) {
      return <Loading />
    }

    return (
      <View className='category-list'>
        <ScrollView
          className='category-list__nav'
          scrollY
        >
          <View className='category-nav'>
            {
              list.map((item, index) =>
                <View
                  className={classNames('category-nav__content', currentIndex === index ? 'category-nav__content-checked' : null)}
                  key={index}
                  onClick={this.handleClickCategoryNav.bind(this, index)}
                >
                  {item.category_name}
                </View>
              )
            }
          </View>
        </ScrollView>
        {/*右*/}
        <ScrollView
          className='category-list__content'
          scrollY
        >
          <View className={classNames(pluralType ? 'category-content' : 'category-content-no')}>
            <Image src={item.image_url} mode='aspectFill' className='category__banner' />
            {
              items.map(item =>
                <View
                  className='category-content__img'
                  key={item.category_id}
                  onClick={this.handleClickItem.bind(this, item)}
                >
                  <Image
                    className={classNames(imgType ? 'cat-img' : 'cat-img-no')}
                    mode='aspectFill'
                    src={item.image_url}
                  />
                  <View className='img-cat-name'>{item.category_name}</View>
                </View>
              )
            }
            {
              [1,2,3,4,5,6,7,8,9,0,2,3,4,5,5].map(() =>
                <View
                  className='category-content__img'
                >
                  <Image
                    className='cat-img'
                    mode='aspectFill'
                  />
                  <View className='img-cat-name'>3333</View>
                </View>
              )
            }

            <View className='category-content__img-empty'> </View>
            <View className='category-content__img-empty'> </View>
            <View className='category-content__img-empty'> </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
