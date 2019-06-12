import Taro, { Component } from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import { connect } from "@tarojs/redux";
import { Loading, SearchBar, TabBar } from '@/components'
import Series from './comps/series'
import { classNames, pickBy } from '@/utils'
import api from '@/api'

import './index.scss'
import {AtTabs, AtTabsPane} from "taro-ui";
@connect(store => ({
  store
}))
export default class Category extends Component {
  constructor (props) {
    super(props)

    this.state = {
      curTabIdx: 0,
      tabList: [],
      contentList: [],
      list: null,
      hasSeries: false,
      isChanged: false
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    /*const nList = pickBy(res, {
      category_name: 'category_name',
      image_url: 'image_url',
      children: 'children'
    })*/

    const query = {template_name: 'yykweishop', version: 'v1.0.1', page_name: 'category'}
    const { list } = await api.category.getCategory(query)
    let seriesList = list[0].params.data
    if(seriesList.length < 1){
      const res = await api.category.get()
      const nList = pickBy(res, {
        name: 'category_name',
        img: 'image_url',
        children: ({ children }) => pickBy(children, {
          name: 'category_name',
          img: 'image_url',
        })
      })
      this.setState({
        list: nList,
        hasSeries: false
      })
    }else {
      let tabList = []
      let contentList = []
      seriesList.map(item => {
        if(item.content.length > 0) {
          tabList.push({ title: item.title, status: item.name })
          contentList.push(item.content)
        }
      })
      const curIndexList = contentList[this.state.curTabIdx]
      const nList = pickBy(curIndexList, {
        name: 'name',
        img: 'img',
        children: 'children'
      })
      this.setState({
        tabList,
        contentList,
        hasSeries: true,
        list: nList,
      })
    }
  }

  handleClickTab = (idx) => {
    const curIndexList = this.state.contentList[idx]

    const nList = pickBy(curIndexList, {
      name: 'name',
      img: 'img',
      children: 'children'
    })
    this.setState({
      curTabIdx: idx,
      list: nList,
    })
    if(idx === this.state.curTabIdx){
      this.setState({
        isChanged: false
      })
    } else {
      this.setState({
        isChanged: true
      })
    }
  }

  handleClickItem (item) {
    const { category_id } = item
    const url = `/pages/item/list?cat_id=${category_id}`

    Taro.navigateTo({
      url
    })
  }

  handleConfirm = (val) => {
    const url = `/pages/item/list?keywords=${val}`

    Taro.navigateTo({
      url
    })
  }

  render () {
    const { curTabIdx, tabList, list, hasSeries, isChanged } = this.state

    return (
      <View className='page-category-index'>
        <SearchBar
          isFixed
          onConfirm={this.handleConfirm}
        />
        {
          tabList.length !== 0
            ? <AtTabs
              className='category__tabs'
              current={curTabIdx}
              tabList={tabList}
              onClick={this.handleClickTab}
            >
              {
                tabList.map((panes, pIdx) =>
                  (<AtTabsPane
                    current={curTabIdx}
                    key={pIdx}
                    index={pIdx}
                  >
                  </AtTabsPane>)
                )
              }
            </AtTabs>
            : null
        }
        <View className={`${hasSeries ? 'category-comps' : 'category-comps-not'}`}>
          <Series
            isChanged={isChanged}
            info={list}
          />
        </View>
        <TabBar
          current={1}
        />
      </View>
    )
  }
}
