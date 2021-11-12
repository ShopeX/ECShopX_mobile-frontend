import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import { pickBy, styleNames } from '@/utils'
import { platformTemplateName } from '@/utils/platform'
import { BaTabBar, BaNavBar } from '../components'
import Series from './comps/series'

import './index.scss'

@connect((store) => ({
  store
}))
export default class BaCategory extends Component {
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

  async componentDidMount () {
    await S.autoLogin(this)
    this.fetch()
  }
  config = {
    navigationStyle: 'custom'
  }

  async fetch () {
    /*const nList = pickBy(res, {
      category_name: 'category_name',
      image_url: 'image_url',
      children: 'children'
    })*/

    const query = { template_name: platformTemplateName, version: 'v1.0.1', page_name: 'category' }
    const { list } = await api.category.getCategory(query)
    console.log('list----->', list)
    let seriesList = list[0] ? list[0].params.data : []
    if (!seriesList.length) {
      const res = await api.category.get()
      const nList = pickBy(res, {
        name: 'category_name',
        img: 'image_url',
        id: 'id',
        category_id: 'category_id',
        children: ({ children }) =>
          pickBy(children, {
            name: 'category_name',
            img: 'image_url',
            id: 'id',
            category_id: 'category_id',
            children: ({ children }) =>
              pickBy(children, {
                name: 'category_name',
                img: 'image_url',
                category_id: 'category_id'
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
        id: 'id'
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

  render () {
    const { curTabIdx, tabList, list, hasSeries, isChanged } = this.state
    const n_ht = S.get('navbar_height', true)
    const c_ht = tabList.length > 0 ? n_ht * 2 - 10 : n_ht
    return (
      <View className='page-category-index'>
        <BaNavBar title='导购商城' fixed jumpType='home' />

        {tabList.length !== 0 ? (
          <View className='category__wrap' style={styleNames({ 'top': `${n_ht}px` })}>
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
          </View>
        ) : null}

        <View
          className={`${
            hasSeries && tabList.length !== 0 ? 'category-comps' : 'category-comps-not'
          }`}
          style={styleNames({ 'top': `${c_ht}px` })}
        >
          <Series isChanged={isChanged} info={list} />
        </View>
        <BaTabBar />
      </View>
    )
  }
}
