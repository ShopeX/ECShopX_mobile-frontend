import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { pickBy } from '@/utils'
import { setPageTitle, platformTemplateName } from '@/utils/platform'
import api from '@/api'
import { AtTabs, AtTabsPane } from 'taro-ui'
import Series from './comps/series'

import './index.scss'

@connect((store) => ({
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

    const query = {
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: 'floor_guide'
    }
    const { list } = await api.category.getCategory(query)
    let seriesList = list[0] ? list[0].params.data : []
    if (seriesList.length) {
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
      let nList = []
      if (curIndexList.length) {
        nList = pickBy(curIndexList, {
          name: 'name',
          tags: 'tags',
          stores: 'stores'
        })
      }
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
      tags: 'tags',
      stores: 'stores'
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

  render () {
    const { curTabIdx, tabList, list, hasSeries, isChanged } = this.state

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
          <Series isChanged={isChanged} info={list} />
        </View>
      </View>
    )
  }
}
