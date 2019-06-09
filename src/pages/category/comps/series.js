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
      // list: null,
      pluralType: true,
      imgType: true,
      currentIndex: 0,
    }
  }

  componentWillReceiveProps (nextProps){
    if(nextProps.isChanged === true) {
      this.setState({
        currentIndex: 0,
      })
    }
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
    const { info, isChanged } = this.props
    const { pluralType, imgType, currentIndex } = this.state
    let items, itemsImg
    if (!info) {
      return <Loading />
    }
    if(info) {
      items = info[currentIndex].children
      itemsImg = info[currentIndex].img
    }


    return (
      <View className='category-list'>
        <ScrollView
          className='category-list__nav'
          scrollY
        >
          <View className='category-nav'>
            {
              info.map((item, index) =>
                <View
                  className={classNames('category-nav__content', currentIndex === index ? 'category-nav__content-checked' : null)}
                  key={index}
                  onClick={this.handleClickCategoryNav.bind(this, index)}
                >
                  {item.name}
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
            <Image src={itemsImg} mode='aspectFill' className='category__banner' />
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
                    src={item.img}
                  />
                  <View className='img-cat-name'>{item.name}</View>
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
