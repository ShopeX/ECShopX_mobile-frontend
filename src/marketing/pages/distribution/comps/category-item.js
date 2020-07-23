import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import { connect } from "@tarojs/redux";
import { Loading, GoodsItem,SpNote } from '@/components'
import { classNames, pickBy } from '@/utils'
//import {AtTabBar, AtTabsPane} from "taro-ui";
import api from '@/api'

import './category-item.scss'

@connect(store => ({
  store
}))
export default class SeriesItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    pluralType: true,
    imgType: true,
    onClick: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      currentIndex: 0,
      categoryId:0,
    }
  }

  componentWillReceiveProps (nextProps){
    if(nextProps.isChanged === true) {
      this.setState({
        currentIndex: 0,
      })
    }
  }
  // componentDidMount (){
  //   this.fetch()
  // }

  handleClickCategoryNav = (gIndex,value) => {
    this.props.onClick(value)
    this.setState({
      currentIndex: gIndex,
      categoryId:value.id
    })
   // console.warn(categoryId)
  }
  // handleClickList= ()=>{
  //   const { categoryId } = this.state
  //   const { defaultId } = this.props
  //   const id = categoryId === 0 ? defaultId : categoryId
  //   let url = ''
  //   if (id){
  //       url = `/pages/distribution/shop-home?id=${id}`
  //   }
  //   if (url) {
  //     Taro.navigateTo({
  //       url
  //     })
  //   }
    
  // }
  handleClickItem = (item) => {
    console.warn(item)
    const { goods_id} = item
    let url = ''
    if (goods_id) {
      url = `/pages/item/espier-detail?id=${goods_id || ''}`
    }
    if (url) {
      Taro.navigateTo({
        url
      })
    }
  }

  // handleCustomClick = (id) => {
  //   if (id) {
  //     Taro.navigateTo({
  //       url: `/pages/custom/custom-page?id=${id}`
  //     })
  //   }
  // }

  render () {
    const { info,content,scrollTop, isChanged, pluralType, imgType } = this.props
    const { currentIndex,page } = this.state
    if (!info) {
      return <Loading />
    }
    // const items = info[currentIndex].children
    // const id = info[currentIndex].id || ''
    // const itemsImg = info[currentIndex].img

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
                  key={`${item.name}${index}`}
                  onClick={this.handleClickCategoryNav.bind(this, index,item)}                  
                >
                  { item.hot && <Text className='hot-tag'></Text> }{item.name}
                </View>
              )
            }
          </View>
        </ScrollView>
        {/*右*/}
        <ScrollView
          className='category-list__content'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >     
        {/* <View className='category-more' onClick={this.handleClickList}>
          更多商品推荐
        </View>     */}
          <View className='grid-goods'> 
          {
            content.length && content.map(item =>{
              return (
                <GoodsItem
                key={item.item_id}
                info={item}
                onClick={() => this.handleClickItem(item)}
              />
              )
            })
          }
          </View> 
          {
            !content.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }                   
        </ScrollView>
      </View>
    )
  }
}
