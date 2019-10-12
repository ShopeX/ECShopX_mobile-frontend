import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { BackToTop, Loading, TagsBar, FilterBar, SearchBar, GoodsItem, NavBar, SpNote } from '@/components'
import api from '@/api'
import { pickBy, classNames } from '@/utils'

import './list.scss'

@connect(({
  member
}) => ({
  favs: member.favs
}))
@withPager
@withBackToTop
export default class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curFilterIdx: 0,
      curTagId: '',
      filterList: [
        { title: '综合' },
        { title: '销量' },
        { title: '价格', sort: -1 }
      ],
      query: null,
      list: [],
      tagsList: [],
      paramsList: [],
      listType: 'grid',
      showDrawer: false,
      selectParams: [],
      info: {},
      areaList: [],
			multiIndex: []
    }
  }

  componentDidMount () {
    this.firstStatus = true

    this.setState({
      query: {
        keywords: this.$router.params.keywords,
        item_type: 'normal',
        is_point: 'false',
        approve_status: 'onsale,only_show',
        category: this.$router.params.cat_id
			},
			curTagId:this.$router.params.tag_id
    }, () => {
      this.nextPage()
    })
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const { selectParams, areaList, tagsList, curTagId } = this.state
    const { distributor_id } = Taro.getStorageSync('curStore')
    const query = {
      ...this.state.query,
      item_params: selectParams,
      tag_id: curTagId,
      distributor_id,
      page,
      pageSize
    }
    const { list, total_count: total, item_params_list = [], select_tags_list = [], select_address_list = []} = await api.item.search(query)
    const { favs } = this.props

    if (areaList.length === 0) {
      let res = await api.member.areaList()
      let regions = []
      select_address_list.map(item => {
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

    item_params_list.map(item => {
      if(selectParams.length < 4){
        selectParams.push({
          attribute_id: item.attribute_id,
          attribute_value_id: 'all'
        })
      }
      item.attribute_values.unshift({attribute_value_id: 'all', attribute_value_name: '全部', isChooseParams: true})
    })

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      promotion_activity: 'promotion_activity',
      price: ({ price }) => (price/100).toFixed(2),
      member_price: ({ member_price }) => (member_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2),
      is_fav: ({ item_id }) => Boolean(favs[item_id])
    })

    this.setState({
      list: [...this.state.list, ...nList],
      showDrawer: false,
      query
    })

    if (this.firstStatus) {
      this.setState({
        paramsList: item_params_list,
        selectParams
      })
      this.firstStatus = false
    }

    if (tagsList.length === 0) {
      this.setState({
        tagsList: select_tags_list,
      })
    }

    return {
      total
    }
  }

  handleTagChange = (data) => {
    const { current } = data

    this.resetPage()
    this.setState({
      list: []
    })

    this.setState({
      curTagId: current
    }, () => {
      this.nextPage()
    })
  }

	handleRegionRefresh = (e) => {
		e.stopPropagation()
    this.resetPage()
    const {query} = this.state
		query.regions_id = []
    this.setState({
      multiIndex: [],
      areaList:[],
      list: [],
			info:{
				city: {label: "", id: ""},
				county: {label: "", id: ""},
				province: {label: "", id: ""}
			},
      query
    }, () => {
      this.nextPage()
    })
	}

  handleFilterChange = (data) => {
    this.setState({
      showDrawer: false
    })
    const { current, sort } = data

    const query = {
      ...this.state.query,
      goodsSort: current === 0
          ? null
          : current === 1
            ? 1
            : (sort > 0 ? 3 : 2)
    }

    if (current !== this.state.curFilterIdx || (current === this.state.curFilterIdx && query.goodsSort !== this.state.query.goodsSort)) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState({
      curFilterIdx: current,
      query
    }, () => {
      this.nextPage()
    })
  }

  handleListTypeChange = () => {
    const listType = this.state.listType === 'grid' ? 'default' : 'grid'

    this.setState({
      listType
    })
  }

  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickFilter = () => {
    this.setState({
      showDrawer: true
    })
  }

  handleClickParmas = (id, child_id) => {
    const { paramsList, selectParams } = this.state
    paramsList.map(item => {
      if(item.attribute_id === id) {
        item.attribute_values.map(v_item => {
          if(v_item.attribute_value_id === child_id) {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      }
    })
    selectParams.map(item => {
      if(item.attribute_id === id) {
        item.attribute_value_id = child_id
      }
    })
    this.setState({
      paramsList,
      selectParams
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
          if(v_item.attribute_value_id === 'all') {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      })
      selectParams.map(item => {
        item.attribute_value_id = 'all'
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
        info.province = {
          label: item.label,
          id: item.id
        }
        item.children.map((s_item,sIndex) => {
          if(sIndex === e.detail.value[1]) {
            info.city = {
              label: s_item.label,
              id: s_item.id
            }
            s_item.children.map((th_item,thIndex) => {
              if(thIndex === e.detail.value[2]) {
                info.county = {
                  label: th_item.label,
                  id: th_item.id
                }
              }
            })
          }
        })
      }
		})

    let regions = [
      info.province.id,
      info.city.id,
      info.county.id
    ]

    this.setState({
      query: {
        ...this.state.query,
        regions_id: regions
      }
    }, () => {
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
		})
		this.setState({
			info
		})
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

  handleConfirm = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        keywords: val,
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

  render () {
    const {
      list,
      listType,
      curFilterIdx,
      filterList,
      showBackToTop,
      scrollTop,
      page,
      showDrawer,
      paramsList,
      selectParams,
      multiIndex,
      areaList,
      tagsList,
      curTagId,
			info
    } = this.state

		return (
			<View className='page-goods-list'>
				<View className='goods-list__toolbar'>
				<SearchBar
  onConfirm={this.handleConfirm.bind(this)}
				/>
          {
            tagsList.length &&
              <TagsBar
                current={curTagId}
                list={tagsList}
                onChange={this.handleTagChange.bind(this)}
              />
          }
          <FilterBar
            className='goods-list__tabs'
            custom
            current={curFilterIdx}
            list={filterList}
            onChange={this.handleFilterChange}
          >
            <View className='filter-bar__item' onClick={this.handleClickFilter.bind(this)}>
              <View className='icon-filter'></View>
              <Text>筛选</Text>
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
								<View className='icon-periscope'></View>
								<Text>{info.city && info.city.label || '产地'}</Text>
							</Picker>
							{info.city && info.city.label  && <Text className='icon-close' onClick={this.handleRegionRefresh.bind(this)}></Text>}
						</View>
          </FilterBar>
        </View>

        <AtDrawer
          show={showDrawer}
          right
          mask
          width={`${Taro.pxTransform(570)}`}
        >
          {
            paramsList.map((item, index) => {
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
            })
          }
          <View className='drawer-footer'>
            <Text className='drawer-footer__btn' onClick={this.handleClickSearchParams.bind(this, 'reset')}>重置</Text>
            <Text className='drawer-footer__btn drawer-footer__btn_active' onClick={this.handleClickSearchParams.bind(this, 'submit')}>确定</Text>
          </View>
        </AtDrawer>

        <ScrollView
          className={classNames('goods-list__scroll', tagsList.length > 0 && 'with-tag-bar')}
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className={`goods-list goods-list__type-${listType}`}>
            {
              list.map(item => {
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
      </View>
    )
  }
}
