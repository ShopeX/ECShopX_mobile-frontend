import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Picker } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { BackToTop, Loading, RecommendItem, SearchBar, TabBar, SpNote, FilterBar } from '@/components'
import api from '@/api'
import { classNames, pickBy } from '@/utils'
import S from '@/spx'

import './list.scss'

@withPager
@withBackToTop
export default class RecommendList extends Component {
  static config = {
    navigationBarTitleText: '文章'
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      query: null,
      showDrawer: false,
      selectColumn: {},
      columnList: [],
      info: {},
      areaList: [],
      multiIndex: [],
      isShowSearch: false,
      shareInfo: {}
    }
  }


  componentDidMount () {
    api.wx.shareSetting({shareindex: 'planting'}).then(res => {
      this.setState({
        shareInfo: res
      })
    })
  }

  componentDidShow () {
    const params = this.$router.params
    if (params) {
      const { id, name } = params
      this.setState({
        selectColumn: {
          id,
          name,
          isChooseColumn: true
        }
      })
    }
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

  onShareAppMessage () {
    const res = this.state.shareInfo
    return {
      title: res.title,
      imageUrl: res.imageUrl
    }
  }

  onShareTimeline () {
    const res = this.state.shareInfo
    return {
      title: res.title,
      imageUrl: res.imageUrl
    }
  }
  
  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const { columnList, areaList } = this.state
    let { selectColumn } = this.state
    const article_query = {
      ...this.state.query,
      article_type: 'bring',
      page,
      pageSize,
      category_id: selectColumn.id
    }

    if (columnList.length === 0) {
      const columns = await api.article.columnList()
      let clist = pickBy(columns, {
        name: 'category_name',
        id: 'category_id'
      })
      let defaultItem = {}
      if (!selectColumn.id) {
        defaultItem = {id: '', name: '全部', isChooseColumn: true}
      } else {
        defaultItem = {id: '', name: '全部', isChooseColumn: false}
        clist.map(item => {
          if(item.id === selectColumn.id) {
            item.isChooseColumn = true
          } else {
            item.isChooseColumn = false
          }
        })
      }
      selectColumn = Object.assign({}, defaultItem)
      clist.unshift(defaultItem)
      this.setState({
        columnList: clist
      })
    }

    const { list, total_count: total, province_list } = S.getAuthToken() ? await api.article.authList(article_query) : await api.article.list(article_query)

    if (areaList.length === 0) {
      let res = await api.member.areaList()
      let regions = []
      province_list.map(item => {
        let match = res.find(area => item == area.id)
        if (match) {
          regions.push(match)
        }
      })
      const addList = pickBy(regions, {
        label: 'label',
        id: 'id',
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
    }

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

  handleConfirm = (val) => {
    this.setState({
      showDrawer: false,
      query: {
        showDrawer: false,
        ...this.state.query,
        title: val,
      }
    }, () =>{
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
    })
  }

  handleClickFilter = () => {
    this.setState({
      showDrawer: true
    })
  }

  handleClickParmas = (id) => {
    let { columnList, selectColumn } = this.state
    columnList.map(item => {
      if(item.id === id) {
        item.isChooseColumn = true
        selectColumn = item
      } else {
        item.isChooseColumn = false
      }
    })
    this.setState({
      columnList,
      selectColumn
    })
  }
	handleRegionRefresh = (e) => {
		e.stopPropagation()
    this.resetPage()
		let {query} = this.state
		Object.assign(query,{regions_id:[],province:'',city:'',area:''})
    this.setState({
      multiIndex: [],
      areaList:[],
      list: [],
			info:{ city: '', county: '', province: '' },
      query
    }, () => {
      this.nextPage()
    })
	}

  handleSearchOn = () => {
    this.setState({
      isShowSearch: true
    })
  }

  handleSearchOff = () => {
    this.setState({
      isShowSearch: false
    })
  }

  handleSearchChange = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        title: val
      }
    })
  }

  handleSearchClear = () => {
    this.setState({
      isShowSearch: false,
      query: {
        ...this.state.query,
        title: ''
      }
    }, () =>{
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
    })
  }

  handleClickSearchParams = (type) => {
    this.setState({
      showDrawer: false
    })
    if(type === 'reset') {
      const { paramsList, selectParams } = this.state
      this.state.paramsList.map(item => {
        item.attribute_values.map(v_item => {
          if(v_item.attribute_value_id === '') {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      })
      selectParams.map(item => {
        item.attribute_value_id = ''
      })
      this.setState({
        paramsList,
        selectParams
      })
    }

    this.resetPage()
    this.setState({
      list: []
    }, () => {
      this.nextPage()
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
        showDrawer: false,
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

    const { province, city, area } = info
    this.setState({
      query: {
        ...this.state.query,
        province,
        city,
        area
      }
    }, () => {
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
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
    const { list, showBackToTop, scrollTop, page, showDrawer, info, columnList, selectColumn, multiIndex, areaList, query, isShowSearch } = this.state
    let address = info.province + info.city

		return (
      <View className='page-recommend-list'>
        <View className='recommend-list__toolbar'>
          <View className={`recommend-list__search ${(query && query.title && isShowSearch) ? 'on-search' : null}`}>
            <SearchBar
              showDailog={false}
              keyword={query ? query.title : ''}
              onFocus={this.handleSearchOn}
              onChange={this.handleSearchChange}
              onClear={this.handleSearchClear}
              onCancel={this.handleSearchOff}
              onConfirm={this.handleConfirm.bind(this)}
            />
          </View>
          <FilterBar
            className='recommend-list__tabs'
          >
            <View className='filter-bar__item' onClick={this.handleClickFilter.bind(this)}>
              <View className='iconfont icon-menu'></View>
              <Text>{ selectColumn.name || '栏目' }</Text>
            </View>
            <View className='filter-bar__item region-picker'>
              <Picker
                mode='multiSelector'
                onClick={this.handleClickPicker}
                onChange={this.bindMultiPickerChange}
                onColumnChange={this.bindMultiPickerColumnChange}
                value={multiIndex}
                range={areaList}
              >
                <View className='iconfont icon-periscope'></View>
                <Text>{address || '地区'}</Text>
							</Picker>
							{address ? <Text className='icon-close' onClick={this.handleRegionRefresh.bind(this)}></Text> : ''}
            </View>
          </FilterBar>
        </View>
        <AtDrawer
          show={showDrawer}
          right
          mask
          width={`${Taro.pxTransform(570)}`}
        >
          <View className='drawer-item'>
            <View className='drawer-item__options'>
              {
                columnList.map((item, index) => {
                  return (
                    <View
                      className={classNames('drawer-item__options__item' ,item.isChooseColumn ? 'drawer-item__options__checked' : '')}
                      // className='drawer-item__options__item'
                      key={`${index}1`}
                      onClick={this.handleClickParmas.bind(this, item.id)}
                    >
                      {item.name}
                    </View>
                  )
                })
              }
              <View className='drawer-item__options__none'> </View>
              <View className='drawer-item__options__none'> </View>
              <View className='drawer-item__options__none'> </View>
            </View>
          </View>
          <View className='drawer-footer'>
            <Text className='drawer-footer__btn' onClick={this.handleClickSearchParams.bind(this, 'reset')}>重置</Text>
            <Text className='drawer-footer__btn drawer-footer__btn_active' onClick={this.handleClickSearchParams.bind(this, 'submit')}>确定</Text>
          </View>
        </AtDrawer>

        <ScrollView
          className='recommend-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='recommend-list recommend-list__type-grid'>
            {
              list.map(item => {
                return (
                  <View className='recommend-list__item'>
                    <RecommendItem
                      key={item.item_id}
                      info={item}
                      onClick={() => this.handleClickItem(item)}
                    />
                  </View>
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

      <TabBar />
      </View>
    )
  }
}
