import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import api from '@/api'
import SpPage from '@/components/sp-page'
import { pickBy } from '@/utils'
import doc from '@/doc'
import './detail.scss'

const initialState = {
  detail: {}
}

function CaseDetail() {
  const [state, setState] = useImmer(initialState)
  const { detail } = state
  const $instance = getCurrentInstance()
  const { design_id, plan_id } = $instance.router.params || {}
  const { levelinfo } = detail || {}

  const handleTo3DPage = () => {
    const { design_pano_url } = detail || {}
    if (!design_pano_url) return
    Taro.navigateTo({
      url: `/pages/webview?url=${encodeURIComponent(design_pano_url)}`
    })
  }

  const getDetailInfo = () => {
    api.design.getDesignDetail({ design_id, plan_id }).then((data) => {
      const detailData = pickBy(data, doc.case.CASE_DETAIL)

      detailData.tagList =
        detailData.taginfo && detailData.taginfo.length > 0
          ? detailData.taginfo.filter((item) => {
              return (
                item.tag_category_name === '户型' ||
                item.tag_category_name === '风格' ||
                item.tag_category_name === '面积'
              )
            })
          : []

      // 将后端返回的 picinfo 按 room_name 分组，生成 roomList
      const picinfo = Array.isArray(detailData.picinfo) ? detailData.picinfo : []
      const roomMap = {}
      picinfo.forEach((item) => {
        const { room_name, img } = item
        if (!room_name || !img) return
        if (!roomMap[room_name]) {
          roomMap[room_name] = {
            room_name,
            imgList: []
          }
        }
        roomMap[room_name].imgList.push(img)
      })
      detailData.roomList = Object.values(roomMap)

      setState((draft) => {
        draft.detail = detailData || {}
      })
    })
  }

  useEffect(() => {
    getDetailInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className='case-detail'>
      <SpPage>
        <View className='case-detail-head'>
          <Image className='case-detail-head--img' src={detail?.cover_pic} mode='widthFix'></Image>
        </View>
        <View className='case-detail-design'>
          <View className='case-detail-design-head'>
            <View className='case-detail-design-head-lf'>
              <View className='case-detail-design-title'>{detail?.design_name}</View>
              {detail?.design_pano_url && (
                <View className='case-detail-design-3d' onClick={handleTo3DPage}>
                  <Text className='iconfont icon-3Dzhanshi'></Text>
                  <Text className='sp-size--sm'>3D方案</Text>
                </View>
              )}
            </View>
            <View className='case-detail-design-lf'>
              <View className='iconfont icon-loufang'></View>
              <View className='case-detail-design-lf-name'>{detail?.comm_name}</View>
            </View>
          </View>

          {detail.tagList && detail.tagList.length > 0 && (
            <View className='case-detail-design-tagList'>
              {detail.tagList.map((item, index) => (
                <View key={`tag-item__${index}`}>
                  <View className='case-detail-design-tagList-item-category'>
                    {item.tag_category_name}
                  </View>
                  <View className='case-detail-design-tagList-item-name'>{item.tag_name}</View>
                </View>
              ))}
            </View>
          )}
        </View>
        <View className='case-detail-houseType'>
          {Array.isArray(levelinfo) && levelinfo.length > 0 && (
            <Swiper
              autoplay
              indicatorDots={levelinfo.length > 1}
              snapToEdge
              duration={500}
              className='case-detail-houseType-swiper'
            >
              {levelinfo.map((item, index) => (
                <SwiperItem key={`house-type__${index}`}>
                  <Image
                    className='case-detail-houseType-img'
                    mode='widthFix'
                    src={item.plan_pic}
                  ></Image>
                </SwiperItem>
              ))}
            </Swiper>
          )}
        </View>
        {detail.roomList &&
          detail.roomList.length > 0 &&
          detail.roomList.map((item, index) => {
            return (
              <View className='case-detail-houseView' key={`room-item__${index}`}>
                <View className='case-detail-houseView-name'>{item.room_name}</View>
                <Swiper
                  autoplay
                  indicatorDots={item.imgList.length > 1}
                  snapToEdge
                  duration={500}
                  className='case-detail-houseView-wrap'
                >
                  {item.imgList.map((iitem, imgIndex) => {
                    return (
                      <SwiperItem key={`room-img__${index}__${imgIndex}`}>
                        <View className='case-detail-houseView-item'>
                          <Image
                            lazyLoad
                            src={iitem}
                            mode='widthFix'
                            className='case-detail-houseView-img'
                          ></Image>
                        </View>
                      </SwiperItem>
                    )
                  })}
                </Swiper>
              </View>
            )
          })}
      </SpPage>
    </View>
  )
}

export default CaseDetail
