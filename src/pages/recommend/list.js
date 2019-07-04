import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { BackToTop, Loading, RecommendItem, NavBar, TabBar, SpNote, FilterBar } from '@/components'
import ListSearch from './comps/list-search'
import api from '@/api'
import { pickBy } from '@/utils'
import S from '@/spx'

import './list.scss'

@withPager
@withBackToTop
export default class RecommendList extends Component {
  static config = {
    navigationBarTitleText: '种草'
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      showDrawer: false,
      info: {},
      areaList: [],
      multiIndex: []
    }
  }

  componentDidShow () {
    Taro.showLoading()
    this.resetPage()
    this.setState({
      list: [],
    })
    setTimeout(()=>{
      this.nextPage()
      Taro.hideLoading()
    }, 200)

    // this.praiseNum()
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const article_query = {
      article_type: 'bring',
      page,
      pageSize
    }

    let res = await api.member.areaList()
    const addList = pickBy(res, {
      label: 'label',
      children: 'children',
    })
    this.addList = addList
    let arrProvice = []
    let arrCity = []
    let arrCounty = []
    addList.map((item, index) => {
      arrProvice.push(item.label)
      if(index === 0) {
        item.children.map((c_item, c_index) => {
          arrCity.push(c_item.label)
          if(c_index === 0) {
            c_item.children.map(cny_item => {
              arrCounty.push(cny_item.label)
            })
          }
        })
      }
    })
    this.setState({
      areaList: [arrProvice, arrCity, arrCounty]
    })

    const { list, total_count: total } = S.getAuthToken() ? await api.article.authList(article_query) : await api.article.list(article_query)

    const nList = pickBy(list, {
      img: 'image_url',
      item_id: 'article_id',
      title: 'title',
      author: 'author',
      summary: 'summary',
      head_portrait: 'head_portrait',
      isPraise: 'isPraise',
      articlePraiseNum: 'articlePraiseNum.count',
    })

    nList.map(item =>{
      if(!item.articlePraiseNum) {
        item.articlePraiseNum = 0
      }
    })

    this.setState({
      list: [...this.state.list, ...nList],
    })

    return {
      total
    }
  }

  handleClickItem = (item) => {
    const url = `/pages/recommend/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickFilter = () => {
    this.setState({
      showDrawer: true
    })
  }

  // 选定开户地区
  handleClickPicker = () => {
    let arrProvice = []
    let arrCity = []
    let arrCounty = []
    if(this.addList){
      this.addList.map((item, index) => {
        arrProvice.push(item.label)
        if(index === 0) {
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if(c_index === 0) {
              c_item.children.map(cny_item => {
                arrCounty.push(cny_item.label)
              })
            }
          })
        }
      })
      this.setState({
        areaList: [arrProvice, arrCity, arrCounty],
        multiIndex: [0, 0, 0]
      })
    }

  }

  bindMultiPickerChange = async (e) => {
    const { info } = this.state
    this.addList.map((item, index) => {
      if(index === e.detail.value[0]) {
        info.province = item.label
        item.children.map((s_item,sIndex) => {
          if(sIndex === e.detail.value[1]) {
            info.city = s_item.label
            s_item.children.map((th_item,thIndex) => {
              if(thIndex === e.detail.value[2]) {
                info.county = th_item.label
              }
            })
          }
        })
      }
    })
    this.setState({ info })
  }

  bindMultiPickerColumnChange = (e) => {
    const { areaList, multiIndex } = this.state
    if(e.detail.column === 0) {
      this.setState({
        multiIndex: [e.detail.value,0,0]
      })
      this.addList.map((item, index) => {
        if(index === e.detail.value) {
          let arrCity = []
          let arrCounty = []
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if(c_index === 0) {
              c_item.children.map(cny_item => {
                arrCounty.push(cny_item.label)
              })
            }
          })
          areaList[1] = arrCity
          areaList[2] = arrCounty
          this.setState({ areaList })
        }
      })
    } else if (e.detail.column === 1) {
      multiIndex[1] = e.detail.value
      multiIndex[2] = 0
      this.setState({
        multiIndex
      },()=>{
        this.addList[multiIndex[0]].children.map((c_item, c_index)  => {
          if(c_index === e.detail.value) {
            let arrCounty = []
            c_item.children.map(cny_item => {
              arrCounty.push(cny_item.label)
            })
            areaList[2] = arrCounty
            this.setState({ areaList })
          }
        })
      })

    } else {
      multiIndex[2] = e.detail.value
      this.setState({
        multiIndex
      })
    }
  }

  render () {
    const { list, showBackToTop, scrollTop, page, showDrawer } = this.state

    return (
      <View className='page-goods-list page-recommend-list'>
        <View className='recommend-list__toolbar'>
          <View class="search-bar">
            <ListSearch
              onConfirm={this.handleConfirm.bind(this)}
            />
          </View>
          <FilterBar
            className='goods-list__tabs'
          >
            <View className='filter-bar__item' onClick={this.handleClickFilter.bind(this)}>
              <View className='icon-filter'></View>
              <Text>筛选</Text>
            </View>
            <View className='filter-bar__item'>
              <Picker
                mode='multiSelector'
                onClick={this.handleClickPicker}
                onChange={this.bindMultiPickerChange}
                onColumnChange={this.bindMultiPickerColumnChange}
                value={multiIndex}
                range={areaList}
              >
                <View className='icon-periscope'></View>
                <Text>{`${info.province}${info.city}` || '产地'}</Text>
              </Picker>
            </View>
          </FilterBar>
        </View>
        <AtDrawer
          show={showDrawer}
          right
          mask
          width={`${Taro.pxTransform(500)}`}
        >
          {
            /* paramsList.map((item, index) => {
              return (
                <View className='drawer-item' key={index}>
                  <View className='drawer-item__title'>
                    <Text>{item.attribute_name}</Text>
                    <View className='at-icon at-icon-chevron-down'> </View>
                  </View>
                  <View className='drawer-item__options'>
                    {
                      item.attribute_values.map((v_item, v_index) => {
                        return (
                          <View
                            className={classNames('drawer-item__options__item' ,v_item.isChooseParams ? 'drawer-item__options__checked' : '')}
                            // className='drawer-item__options__item'
                            key={v_index}
                            onClick={this.handleClickParmas.bind(this, item.attribute_id, v_item.attribute_value_id)}
                          >
                            {v_item.attribute_value_name}
                          </View>
                        )
                      })
                    }
                    <View className='drawer-item__options__none'> </View>
                    <View className='drawer-item__options__none'> </View>
                    <View className='drawer-item__options__none'> </View>
                  </View>
                </View>
              )
            }) */
          }
          <View className='drawer-footer'>
            <Text className='drawer-footer__btn' onClick={this.handleClickSearchParams.bind(this, 'reset')}>重置</Text>
            <Text className='drawer-footer__btn drawer-footer__btn_active' onClick={this.handleClickSearchParams.bind(this, 'submit')}>确定</Text>
          </View>
        </AtDrawer>
        <View className='goods-list__toolbar'>
          <NavBar
            leftIconType='chevron-left'
            fixed='true'
          />
        </View>

        <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='goods-list goods-list__type-grid'>
            {
              list.map(item => {
                return (
                  <RecommendItem
                    key={item.item_id}
                    info={item}
                    onClick={() => this.handleClickItem(item)}
                  />
                )
              })
            }
          </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

      <TabBar current={2} />
      </View>
    )
  }
}
