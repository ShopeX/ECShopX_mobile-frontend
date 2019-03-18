import Taro, { Component } from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import { Loading, SearchBar } from '@/components'
import { classNames, pickBy } from '@/utils'
import api from '@/api'

import './index.scss'

export default class Category extends Component {
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
      <View className='page-category-index'>
        <SearchBar
          isFixed
        />
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
              <View className='category-content__img-empty'> </View>
              <View className='category-content__img-empty'> </View>
              <View className='category-content__img-empty'> </View>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
