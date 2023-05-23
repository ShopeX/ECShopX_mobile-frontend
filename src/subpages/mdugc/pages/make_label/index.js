import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import S from '@/spx'
import { SearchBar } from '../../components'
import { SpNote, BackToTop, Loading } from '@/components'
import { connect } from 'react-redux'
import { pickBy, styleNames, getThemeStyle } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'

import api from '@/api'

//import '../../font/iconfont.scss'
import './index.scss'
@connect(({ member }) => ({
  memberData: member.member
}))
@withPager
@withBackToTop
export default class make_label extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      val: '' //搜索框
    }
  }

  componentDidMount() {
    this.nextPage()
  }
  config = {
    navigationBarTitleText: '添加标签'
  }
  componentDidShow() {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    })
  }
  // 搜索
  shonChange = (val) => {
    console.log('输入框值改变', val)
  }
  shonClear = () => {
    console.log('清除')
    this.resetPage()
    this.setState({
      list: []
    })

    this.setState(
      {
        val: ''
      },
      () => {
        this.nextPage()
      }
    )
  }
  shonConfirm = (val) => {
    console.log('完成触发', val)
    this.resetPage()
    this.setState({
      list: []
    })

    this.setState(
      {
        val
      },
      () => {
        this.nextPage()
      }
    )
  }

  // 列表
  async fetch(params) {
    const { val } = this.state
    const { page_no: page, page_size: pageSize } = params
    const that = this
    params = {
      page,
      pageSize,
      tag_name: val
    }
    const { list, total_count: total } = await api.mdugc.taglist(params)
    console.log('list, total', list, total)

    const nList = pickBy(list, {
      tag_id: 'tag_id',
      tag_name: 'tag_name'
    })
    this.setState(
      {
        list: [...this.state.list, ...nList]
      },
      () => {
        if (page == 1 && total > 10) {
          that.nextPage()
        }
      }
    )

    return { total }
  }
  handleClickItem = (item) => {
    console.log('item', item)
  }
  topages = (item) => {
    let pages = Taro.getCurrentPages() // 获取当前的页面栈
    let prevPage = pages[pages.length - 2] // 获取上一页面
    prevPage.setData({
      //设置上一个页面的值
      label: item
    })
    setTimeout(() => {
      Taro.navigateBack({
        delta: 1
      })
    }, 500)
  }
  addtag = async () => {
    let { val } = this.state
    const { memberData } = this.props
    console.log('memberData', memberData)

    let data = {
      user_id: memberData.memberInfo.user_id,
      tag_name: val
    }
    let { tag_id, tag_name, message, status } = await api.mdugc.tagcreate(data)
    if (status == 1) {
      this.topages({ tag_name, tag_id })
    }
    Taro.showToast({
      icon: 'none',
      title: message,
      duration: 1000
    })
  }

  render() {
    const { list, val, page, showBackToTop, scrollTop } = this.state
    return (
      <View className='ugcindex' style={styleNames(getThemeStyle())}>
        <View className='ugcindex_search'>
          <SearchBar
            onChange={this.shonChange.bind(this)}
            onClear={this.shonClear.bind(this)}
            onConfirm={this.shonConfirm.bind(this)}
            _placeholder='请输入'
            maxLength='20'
            keyword={val}
          ></SearchBar>
        </View>

        <View className='ugcindex_list'>
          <ScrollView
            scrollY
            className='ugcindex_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
            <View className='ugcindex_list__scroll_scrolls'>
              {!page.isLoading &&
              !page.hasNext &&
              val &&
              (list.length == 0 || list[0].tag_name != val) ? (
                <View className='ugcindex_list__scroll_scrolls_item top'>
                  {val}
                  <View
                    className='ugcindex_list__scroll_scrolls_item_r'
                    onClick={this.addtag.bind(this)}
                  >
                    <View className='ugcindex_list__scroll_scrolls_item_r_icon iconfont icon-tianjia1'></View>
                    添加标签
                  </View>
                </View>
              ) : null}

              {list.map((item) => {
                return (
                  <View
                    onClick={this.topages.bind(this, item)}
                    className='ugcindex_list__scroll_scrolls_item'
                  >
                    {item.tag_name}
                  </View>
                )
              })}
            </View>
            {page.isLoading && <Loading>正在加载...</Loading>}
            {/* {
                !page.isLoading && !page.hasNext && !list.length
                && (<SpNote img='trades_empty.png'>列表页为空!</SpNote>)
              } */}
          </ScrollView>
        </View>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} bottom={150} />
      </View>
    )
  }
}
