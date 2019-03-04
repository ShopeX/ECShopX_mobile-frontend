import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import { AtSearchBar, AtButton } from 'taro-ui'
import { Loading, SearchBar } from '@/components'
import { classNames } from '@/utils'
import { lockScreen } from '@/utils/dom'
import api from '@/api'

import './index.scss'

export default class CartIndex extends Component {
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
    const { categorys } = await api.category.get()
    this.setState({
      list: categorys
    })
  }

  handleClickCategoryNav = (gIndex) => {
    this.setState({
      currentIndex: gIndex
    })
  }

  render () {
    const { list, pluralType, imgType, currentIndex } = this.state
    let items
    if(list) {
      items = list[currentIndex].lv2
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
                    {item.cat_name}
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
                  <View className='category-content__img' key={item.cat_id}>
                    <Image
                      className={classNames(imgType ? 'cat-img' : 'cat-img-no')}
                      mode='aspectFill'
                      src={item.cat_logo}
                    />
                    <View className='img-cat-name'>{item.cat_name}</View>
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
