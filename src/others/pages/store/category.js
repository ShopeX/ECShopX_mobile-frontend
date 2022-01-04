import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtTabs, AtTabsPane, AtTabBar } from 'taro-ui'
import api from '@/api'
import { pickBy, getCurrentRoute } from '@/utils'
import { platformTemplateName } from '@/utils/platform'
import Series from './comps/series'

import './category.scss'

@connect((store) => ({
  store
}))
export default class Category extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      curTabIdx: 0,
      tabList: [],
      contentList: [],
      list: null,
      hasSeries: false,
      isChanged: false,
      localCurrent: 2,
      tabBarList: [
        {
          title: '店铺首页',
          iconType: 'home',
          iconPrefixClass: 'iconfont icon',
          url: '/pages/store/index'
        },
        {
          title: '商品列表',
          iconType: 'list',
          iconPrefixClass: 'iconfont icon',
          url: '/others/pages/store/list'
        },
        {
          title: '商品分类',
          iconType: 'category',
          iconPrefixClass: 'iconfont icon',
          url: '/others/pages/store/category'
        }
      ]
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
    const options = this.$instance.router.params
    const id = options.id
    const query = {
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: 'category',
      distributor_id: id
    }
    const { list } = await api.category.getCategory(query)
    let seriesList = list[0] ? list[0].params.data : []
    if (!seriesList.length) {
      const param = { distributor_id: id }
      const res = await api.category.get(param)
      const nList = pickBy(res, {
        name: 'category_name',
        img: 'image_url',
        id: 'id',
        category_id: 'category_id',
        is_main_category: 'is_main_category',
        children: ({ children }) =>
          pickBy(children, {
            name: 'category_name',
            img: 'image_url',
            id: 'id',
            is_main_category: 'is_main_category',
            category_id: 'category_id',
            children: ({ children }) =>
              pickBy(children, {
                name: 'category_name',
                img: 'image_url',
                category_id: 'category_id',
                is_main_category: 'is_main_category'
              })
          })
      })
      this.setState({
        list: nList,
        hasSeries: false
      })
    } else {
      let tabList = []
      let contentList = []
      if (list[0].params.hasSeries) {
        seriesList.map((item) => {
          tabList.push({ title: item.title, status: item.name })
          contentList.push(item.content)
        })
      } else {
        contentList.push(seriesList)
      }
      const curIndexList = contentList[this.state.curTabIdx]
      const nList = pickBy(curIndexList, {
        name: 'name',
        img: 'img',
        children: 'children',
        hot: 'hot',
        id: 'id',
        is_main_category: 'is_main_category'
      })
      this.setState({
        tabList,
        contentList,
        hasSeries: true,
        list: nList
      })
    }
  }

  handleClickTab = (idx) => {
    const curIndexList = this.state.contentList[idx]

    const nList = pickBy(curIndexList, {
      name: 'name',
      img: 'img',
      children: 'children',
      hot: 'hot',
      id: 'id'
    })
    this.setState({
      curTabIdx: idx,
      list: nList
    })
    if (idx === this.state.curTabIdx) {
      this.setState({
        isChanged: false
      })
    } else {
      this.setState({
        isChanged: true
      })
    }
  }

  handleClick = (current) => {
    const cur = this.state.localCurrent
    if (cur !== current) {
      const curTab = this.state.tabBarList[current]
      const { url } = curTab
      const options = this.$instance.router.params
      const id = options.id
      const fullPath = getCurrentRoute(this.$instance.router).fullPath.split('?')[0]
      const param = current === 1 ? `?dis_id=${id}` : `?id=${id}`
      if (url && fullPath !== url) {
        Taro.redirectTo({ url: `${url}${param}` })
      }
    }
  }

  render () {
    const { curTabIdx, tabList, list, hasSeries, isChanged, localCurrent, tabBarList } = this.state
    const options = this.$instance.router.params
    return (
      <View className='page-category-index'>
        {tabList.length !== 0 ? (
          <AtTabs
            className='category__tabs'
            current={curTabIdx}
            tabList={tabList}
            onClick={this.handleClickTab}
          >
            {tabList.map((panes, pIdx) => (
              <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
            ))}
          </AtTabs>
        ) : null}
        <View
          className={`${
            hasSeries && tabList.length !== 0 ? 'category-comps' : 'category-comps-not'
          }`}
        >
          <Series isChanged={isChanged} info={list} storeId={options.id} />
        </View>
        <AtTabBar fixed tabList={tabBarList} onClick={this.handleClick} current={localCurrent} />
      </View>
    )
  }
}
