import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import { connect } from "@tarojs/redux";
import { Loading } from '@/components'
import { classNames } from '@/utils'

import './series.scss'
@connect(store => ({
  store
}))
export default class Series extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    pluralType: true,
    imgType: true
  }

  constructor (props) {
    super(props)

    this.state = {
      currentIndex: 0,
      curTag: 0
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

  handleTagClick = (id) => {
    this.setState({
      curTag: id
    })
  }

  handleClickItem = (item) => {
    const { category_id } = item
    const url = `/pages/store/index?id=${item.id}`

    Taro.navigateTo({
      url
    })
  }

  render () {
    const { info, isChanged, pluralType, imgType } = this.props
    const { currentIndex, curTag } = this.state
    if (!info) {
      return <Loading />
    }
    const items = info[currentIndex].stores
    const id = info[currentIndex].id
    const tags = info[currentIndex].tags


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
                  className={classNames('category-nav__content', currentIndex == index ? 'category-nav__content-checked' : null)}
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
        <View>
          {
            tags.length > 0 &&
              <ScrollView
                className='tag-list'
                scrollX>
                <View
                  className={`tag-item ${curTag === 0 ? 'active' : null}`}
                  onClick={this.handleTagClick.bind(this, 0)}>
                  全部
                </View>
                {
                  tags.map(item =>
                    <View
                      className={`tag-item ${curTag === item.id ? 'active' : null}`}
                      onClick={this.handleTagClick.bind(this, item.id)}>
                      {item.name}
                    </View>
                  )
                }
              </ScrollView>
          }
          <ScrollView
            className='category-list__content'
            scrollY
          >
            <View className={classNames(pluralType ? 'category-content' : 'category-content-no')}>
              {
                items.map(item => {
                  return (
                    (curTag === 0 || item.tags.findIndex(n => n.id === curTag) !== -1) &&
                      <View
                        key={item.id}
                        className='category-content__img'
                        onClick={this.handleClickItem.bind(this, item)}
                      >
                        {
                          item.logo
                          && <Image
                                className='cat-img'
                                mode='scaleToFill'
                                src={item.logo}
                              />
                        }
                        <View className='img-cat-name'>
                          <View className='item-name'>{item.name}</View>
                          <View className='item-tags'>
                            {
                              item.tags.map(tag =>
                                <Text className='item-tag'>{tag.name}</Text>
                              )
                            }
                          </View>
                        </View>
                      </View>
                  )
                })
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
