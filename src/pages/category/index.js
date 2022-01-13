import React, { memo, Component } from 'react'
import { View } from '@tarojs/components'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { connect } from 'react-redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { pickBy } from '@/utils'
import { setPageTitle, platformTemplateName } from '@/utils/platform'
import { TabBar, SpTabbar } from '@/components'
import Series from './comps/series'

import './index.scss'

const initialState = {
  activeIndex: 0,
  tabList: [], // 横向tab //
  contentList: [],
  hasSeries:false,  //是否有多级
}

const Category = (props) => {

  const [state, setState] = useImmer(initialState);
  // 获取数据
  useEffect(() => {
    getConfig()
  }, [])

  const getConfig = async () => {
    const query = { template_name: platformTemplateName, version: 'v1.0.1', page_name: 'category' }
    const { list } = await api.category.getCategory(query)
    let seriesList = list[0] ? list[0].params.data : []
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
    console.log('tabList====',tabList);

    console.log('contentList====',contentList);
    const curIndexList = contentList[state.activeIndex]
    console.log('curIndexList ====', curIndexList);
    const nList = pickBy(curIndexList, {
      name: 'name',
      img: 'img',
      children: 'children',
      hot: 'hot',
      id: 'id'
    })
    setState((v) => {
        v.tabList = tabList,
        v.contentList = contentList,
        v.hasSeries = true,
        v.list = nList
    })

  }


  return (
    <View>
      <View>category</View>
    </View>
  )
}

export default memo(Category)

// export default class Category extends Component {
//   constructor (props) {
//     super(props)

//     this.state = {
//       curTabIdx: 0,
//       tabList: [],
//       contentList: [],
//       list: null,
//       hasSeries: false,
//       isChanged: false
//     }
//   }

//   componentDidMount () {
//     setPageTitle('商品分类')
//     this.fetch()
//   }

//   async fetch () {
//     /*const nList = pickBy(res, {
//       category_name: 'category_name',
//       image_url: 'image_url',
//       children: 'children'
//     })*/

//     const query = { template_name: platformTemplateName, version: 'v1.0.1', page_name: 'category' }
//     const { list } = await api.category.getCategory(query)
//     let seriesList = list[0] ? list[0].params.data : []
//     if (!seriesList.length) {
//       const res = await api.category.get()
//       const nList = pickBy(res, {
//         name: 'category_name',
//         img: 'image_url',
//         id: 'id',
//         category_id: 'category_id',
//         children: ({ children }) =>
//           pickBy(children, {
//             name: 'category_name',
//             img: 'image_url',
//             id: 'id',
//             category_id: 'category_id',
//             children: ({ children }) =>
//               pickBy(children, {
//                 name: 'category_name',
//                 img: 'image_url',
//                 category_id: 'category_id'
//               })
//           })
//       })
//       this.setState({
//         list: nList,
//         hasSeries: false
//       })
//     } else {
//       let tabList = []
//       let contentList = []
//       if (list[0].params.hasSeries) {
//         seriesList.map((item) => {
//           tabList.push({ title: item.title, status: item.name })
//           contentList.push(item.content)
//         })
//       } else {
//         contentList.push(seriesList)
//       }
//       const curIndexList = contentList[this.state.curTabIdx]
//       const nList = pickBy(curIndexList, {
//         name: 'name',
//         img: 'img',
//         children: 'children',
//         hot: 'hot',
//         id: 'id'
//       })
//       this.setState({
//         tabList,
//         contentList,
//         hasSeries: true,
//         list: nList
//       })
//     }
//   }

//   handleClickTab = (idx) => {
//     const curIndexList = this.state.contentList[idx]

//     const nList = pickBy(curIndexList, {
//       name: 'name',
//       img: 'img',
//       children: 'children',
//       hot: 'hot',
//       id: 'id'
//     })
//     this.setState({
//       curTabIdx: idx,
//       list: nList
//     })
//     if (idx === this.state.curTabIdx) {
//       this.setState({
//         isChanged: false
//       })
//     } else {
//       this.setState({
//         isChanged: true
//       })
//     }
//   }

//   render () {
//     const { curTabIdx, tabList, list, hasSeries, isChanged } = this.state

//     return (
//       <View className='page-category-index'>
//         {tabList.length !== 0 ? (
//           <AtTabs
//             className='category__tabs'
//             current={curTabIdx}
//             tabList={tabList}
//             onClick={this.handleClickTab}
//           >
//             {tabList.map((panes, pIdx) => (
//               <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
//             ))}
//           </AtTabs>
//         ) : null}
//         <View
//           className={`${
//             hasSeries && tabList.length !== 0 ? 'category-comps' : 'category-comps-not'
//           }`}
//         >
//           <Series isChanged={isChanged} info={list} />
//         </View>
//         <SpTabbar />
//       </View>
//     )
//   }
// }

