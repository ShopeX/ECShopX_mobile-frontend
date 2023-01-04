import React, { useEffect, useState, useCallback } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { pickBy } from '@/utils'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpToast, Loading, SpNote, SearchBar } from '@/components'
import api from '@/api'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import {TagsBarcheck,Scrollitem} from '../../components'




import './index2.scss'


const initialState = {
  list: [],
  oddList:[],
  evenList:[],
  curTagId:[],//标签
  istag:1,//时间、热度
  val:'',//搜索框
  tagsList:[],
  refresherTriggered:false
}

function MdugcIndex() {
  const [state, setState] = useImmer(initialState)
  const { initState, openRecommend, openLocation, openStore, appName } = useSelector(
    (state) => state.sys
  )

  const [policyModal, setPolicyModal] = useState(false)
  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { openScanQrcode } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()



  const dispatch = useDispatch()

  useEffect(() => {
    gettopicslist()
    // nextPage()
  }, [])


   // 搜索
  const  shonChange =(val)=>{
    // console.log("输入框值改变",val)
  }
  const shonClear=()=>{
    console.log("清除")
    // resetPage()
    setState(draft=>{
      draft.list = [],
      draft.oddList = [],
      draft.evenList = [],
      draft.val = ''
    })
  }
  const shonConfirm=(val)=>{
    console.log("完成触发",val)
    // resetPage()
    setState(draft => {
      draft.list = [],
      draft.oddList = [],
      draft.evenList = [],
      draft.val = val
    })

  }

const handleTagChange=(id)=>{
  console.log("这是选中标签",id)
  let {curTagId}=state
  // this.resetPage()
  setState(draft => {
    draft.list = [],
    draft.oddList = [],
    draft.evenList = []
  })
  let idx=curTagId.findIndex((item)=>{
    return item==id
  })
  if(idx>=0){
    curTagId.splice(idx,1)
  }else{
    curTagId.push(id)
  }
  setState(draft=>{
    draft.curTagId = curTagId
  }, () => {
    // this.nextPage()
    console.log(123)
  })
}

const gettopicslist = async() => {
  let data={
    page:1,
    pageSize:8
  }
  debugger
  let { list } = await api.mdugc.topiclist(data)
  let nList = pickBy(list, {
    topic_id:"topic_id",
    topic_name:"topic_name"
  })
  setState(draft => {
    draft.tagsList = nList
  })

}

const {val, tagsList, curTagId } = state
  return (
    <View className='ugcindex'>
    <View className='ugcindex_search'>
      <SearchBar
        showDailog={false}
        keyword={val}
        placeholder='搜索'
        onFocus={() => false}
        onCancel={() => {}}
        onChange={shonChange.bind(this)}
        onClear={shonClear.bind(this)}
        onConfirm={shonConfirm.bind(this)}
      />
    </View>
    <View className='ugcindex_tagsbar'>
          {
            tagsList.length &&
            <TagsBarcheck
              current={curTagId}
              list={tagsList}
              onChange={handleTagChange.bind(this)}
            />
          }
        </View>
    {/* <ScrollView
      className='goods-list__scroll'
      scrollY
      scrollTop={scrollTop}
      scrollWithAnimation
      onScroll={this.handleScroll}
      onScrollToLower={this.nextPage}
    >
      <View className='goods-list'>
        {list.map((item, index) => {
          const isRelease = goodsIds.findIndex((n) => item.goods_id == n) !== -1
          return (
            <View className='shop-goods-item' key={item.goods_id}>
              <View className='shop-goods'>
                <View className='shop-goods__caption'>
                  <Image className='shop-goods__thumbnail' src={item.img} mode='aspectFill' />
                  <View className='view-flex-item'>
                    <View className='shop-goods__title'>{item.title}</View>
                    <View className='shop-goods__desc'>{item.desc}</View>
                    <View className='shop-goods__price'>
                      <Text className='cur'>¥</Text> {item.price}
                    </View>
                  </View>
                  <View className='shop-goods__task'>
                    <View className='shop-goods__task-label'>任务模式</View>
                    {item.rebate_type === 'total_num' && (
                      <View className='shop-goods__task-type'>按售出总量</View>
                    )}
                    {item.rebate_type === 'total_money' && (
                      <View className='shop-goods__task-type'>按总销售金额</View>
                    )}
                  </View>
                </View>
                {!item.view_detail ? (
                  <View
                    className='shop-goods__detail'
                    onClick={this.handleViewDetail.bind(this, index, item.goods_id)}
                  >
                    <Text className='icon-search'></Text> 查看指标明细
                  </View>
                ) : (
                  <View className='shop-goods__detail'>
                    <View className='content-bottom-padded view-flex'>
                      <View className='view-flex-item2'>规格</View>
                      <View className='view-flex-item'>指标</View>
                      <View className='view-flex-item'>奖金</View>
                    </View>
                    {item.details &&
                      item.details.map((detail, dindex) => (
                        <View class='shop-goods__detail-item' key={`detail4${dindex}`}>
                          <View className='shop-goods__detail-skus view-flex-item2'>
                            {detail.item_spec ? (
                              detail.item_spec &&
                              detail.item_spec.map((sku, sindex) => (
                                <View className='sku-item' key={`sku${sindex}`}>
                                  {sku.spec_image_url && (
                                    <Image
                                      className='sku-img'
                                      src={sku.spec_image_url}
                                      mode='aspectFill'
                                    />
                                  )}
                                  {sku.spec_custom_value_name || sku.spec_value_name}
                                </View>
                              ))
                            ) : (
                              <Text>单规格</Text>
                            )}
                          </View>
                          {detail.task && (
                            <View className='view-flex-item2'>
                              {detail.task.map((task, tindex) => (
                                <View className='view-flex' key={`task${tindex}`}>
                                  <View className='view-flex-item'>{task.filter}</View>
                                  <View className='view-flex-item'>
                                    {task.money && <Text>¥</Text>}
                                    {task.money}
                                  </View>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      ))}
                  </View>
                )}
              </View>
              <View className='shop-goods__footer'>
                <View
                  className={classNames(
                    'shop-goods__footer-item',
                    !isRelease ? 'unreleased' : null
                  )}
                  onClick={this.handleItemRelease.bind(this, item.item_id)}
                >
                  {isRelease ? (
                    <Text className='icon-moveDown'> 从小店下架</Text>
                  ) : (
                    <Text className='icon-moveUp'> 上架到小店</Text>
                  )}
                </View>
                <Button
                  className='shop-goods__footer-item'
                  dataInfo={item}
                  openType='share'
                  size='small'
                >
                  <Text className='icon-share2'> 分享给好友</Text>
                </Button>
              </View>
            </View>
          )
        })}
      </View>
      {page.isLoading ? <Loading>正在加载...</Loading> : null}
      {!page.isLoading && !page.hasNext && !list.length && (
        <SpNote img='trades_empty.png'>暂无数据~</SpNote>
      )}
    </ScrollView> */}
    <SpToast />
  </View>
  )
}

export default MdugcIndex
