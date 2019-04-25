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
      tabList: [
        {title: '产品类别', status: '0'},
        {title: '护肤系列', status: '1'}
      ],
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

  handleClickTab = (idx) => {
    console.log(idx, 46)
    this.setState({
      curTabIdx: idx
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
    const { curTabIdx, tabList, list } = this.state

    return (
      <View className='page-category-index'>
        <SearchBar
          isFixed
        />
        <AtTabs
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
        <View className='category-comps'>
          <Series
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
