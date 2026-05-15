/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Picker, ScrollView } from '@tarojs/components'
import { SpPage, SpImage, SpButton, SpUpload, SpCell, SpInput } from '@/components'
import { SpPicker } from '@/subpages/components'
import { AtButton, AtTextarea, AtInput } from 'taro-ui'
import imgUploader from '@/utils/upload'
import { classNames, showToast, pickBy } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import api from '@/api'
import * as communityApi from '@/api/community'
import doc from '@/subpages/doc'
import { updateSelectGoods, updateSelectCommunityZiti } from '@/store/slices/community'
import dayjs from 'dayjs'
import CompGoodsItem from './comps/comp-goodsitem'
import './group.scss'

const COMPS_LIST = [
  { labelKey: 'fb7ff6e1.780c04', icon: 'icon-picture', key: 'bigimage' },
  { labelKey: 'fb7ff6e1.ca746b', icon: 'icon-bianji1', key: 'text' }
]

const initialState = {
  comps: [
    {
      type: 'text',
      value: ''
    }
  ],
  qrcode: [],
  activityName: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  shareImageUrl: ''
}
function Group(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { userInfo = {} } = useSelector((state) => state.user)
  const { selectCommunityZiti, selectGoods } = useSelector((state) => state.community)
  const { qrcode, activityName, comps, startDate, startTime, endDate, endTime, shareImageUrl } =
    state
  const dispatch = useDispatch()
  const $instance = getCurrentInstance() || {}
  const pageRef = useRef('')

  useEffect(() => {
    if ($instance?.router?.params.id) {
      fetchActivity()
    }
    Taro.nextTick(() => {
      pageRef.current && pageRef.current.pageLock()
    })
  }, [])

  const fetchActivity = async () => {
    const res = await communityApi.getChiefActivity($instance?.router?.params.id)
    console.log('fetchDetail:', pickBy(res, doc.community.COMMUNITY_ACTIVITY_ITEM))
    const { activityIntro, activityName, activityPics, startTime, endTime, shareImageUrl } = pickBy(
      res,
      doc.community.COMMUNITY_ACTIVITY_ITEM
    )
    setState((draft) => {
      draft.comps = activityIntro
      draft.qrcode = activityPics
      draft.activityName = activityName
      // draft.goodsList = _items
      draft.startDate = dayjs(startTime * 1000).format('YYYY-MM-DD')
      draft.startTime = dayjs(startTime * 1000).format('HH:mm')
      draft.endDate = dayjs(endTime * 1000).format('YYYY-MM-DD')
      draft.endTime = dayjs(endTime * 1000).format('HH:mm')
      draft.shareImageUrl = shareImageUrl
    })

    const _ziti = pickBy(res.ziti[0], doc.community.COMMUNITY_ZITI)
    dispatch(updateSelectCommunityZiti(_ziti))

    const _items = pickBy(res.items, doc.community.COMMUNITY_GOODS_ITEM)
    console.log(`_items:`, _items)
    dispatch(updateSelectGoods(_items))
  }

  const onCompsClick = async ({ key }) => {
    if (key == 'bigimage') {
      const { tempFilePaths } = await Taro.chooseImage({
        sourceType: ['camera', 'album'],
        count: 1
      })
      const resultFiles = tempFilePaths.map((item) => ({
        url: item,
        file: item
      }))
      imgUploader.uploadImageFn(resultFiles).then((res) => {
        console.log('---uploadImageFn res---', res)
        const { url } = res[0]
        setState((draft) => {
          draft.comps = comps.concat([{ type: key, value: url }])
        })
      })
    } else {
      setState((draft) => {
        draft.comps = comps.concat([{ type: key, value: '' }])
      })
    }
  }

  const getCompLabel = ({ type }) => {
    const res = COMPS_LIST.find((item) => item.key == type)
    return res ? $t(res.labelKey) : ''
  }

  const handleClickAction = async ({ type }, action, index) => {
    let tempComps = [...comps]
    switch (action) {
      case 'up':
        if (index == 0) return
        tempComps[index - 1] = comps[index]
        tempComps[index] = comps[index - 1]
        setState((draft) => {
          draft.comps = tempComps
        })
        break
      case 'down':
        if (index == comps.length - 0) return
        tempComps[index + 1] = comps[index]
        tempComps[index] = comps[index + 1]
        setState((draft) => {
          draft.comps = tempComps
        })
        break
      case 'top':
        if (index == 0) return
        const temp = tempComps.pop()
        tempComps.unshift(temp)
        setState((draft) => {
          draft.comps = tempComps
        })
        break
      case 'add':
        onCompsClick({ key: type })
        break
      case 'delete':
        const { confirm } = await Taro.showModal({
          content: $t('fb7ff6e1.daedc7')
        })
        if (confirm) {
          tempComps.splice(index, 1)
          setState((draft) => {
            draft.comps = tempComps
          })
        }
        break
    }
  }

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft[key] = value
    })
  }

  const onTextAreaChange = (index, value) => {
    const _comps = JSON.parse(JSON.stringify(comps))
    _comps[index].value = value
    setState((draft) => {
      draft.comps = _comps
    })
  }

  const createChiefActivity = async () => {
    if (!activityName) {
      return showToast($t('fb7ff6e1.8ee7c2'))
    }

    // if (qrcode.length == 0) {
    //   return showToast('请上传团长个人微信二维码')
    // }

    const comp = comps.find((item) => !item.value)
    if (comp) {
      if (comp.type == 'text') {
        return showToast($t('fb7ff6e1.19c54d'))
      }
      if (comp.type == 'bigimage') {
        return showToast($t('fb7ff6e1.560fb7'))
      }
    }

    if (selectGoods.length == 0) {
      return showToast($t('fb7ff6e1.25e390'))
    }

    if (!selectCommunityZiti) {
      return showToast($t('edc703ce.cb8251'))
    }

    if (!startDate || !startTime) {
      return showToast($t('fb7ff6e1.6a4b8c'))
    }

    if (!endDate || !endTime) {
      return showToast($t('fb7ff6e1.76caf1'))
    }

    const params = {
      activity_name: activityName,
      activity_pics: qrcode,
      activity_intro: JSON.stringify(comps),
      items: selectGoods.map((item) => item.itemId),
      ziti: selectCommunityZiti.id,
      start_time: `${startDate} ${startTime}`,
      end_time: `${endDate} ${endTime}`,
      share_image_url: shareImageUrl
    }
    let cur_id = $instance?.router?.params.id
    let act_id
    // 修改活动
    if (cur_id) {
      await communityApi.modiflyChiefActivity(cur_id, params)
      act_id = cur_id
    } else {
      const { activity_id } = await communityApi.createChiefActivity(params)
      act_id = activity_id
    }

    dispatch(updateSelectGoods([]))
    dispatch(updateSelectCommunityZiti(null))
    showToast(cur_id ? $t('fb7ff6e1.ec1cf6') : $t('fb7ff6e1.265420'))
    setTimeout(() => {
      if (cur_id) {
        Taro.navigateBack()
      } else {
        Taro.redirectTo({
          url: `/subpages/community/group-leaderdetail?activity_id=${act_id}`
        })
      }
    }, 200)
  }

  const onChooseClick = async () => {
    const { tempFilePaths } = await Taro.chooseImage({
      sourceType: ['camera', 'album'],
      count: 1
    })
    const resultFiles = tempFilePaths.map((item) => ({
      url: item,
      file: item
    }))
    imgUploader.uploadImageFn(resultFiles).then((res) => {
      const { url } = res[0]
      setState((draft) => {
        draft.shareImageUrl = url
      })
    })
  }

  return (
    <SpPage
      className='page-community-group'
      ref={pageRef}
      renderFooter={
        <View className='btn-group'>
          <AtButton circle type='primary' onClick={createChiefActivity}>
            {$t('fb7ff6e1.965178')}
          </AtButton>
        </View>
      }
    >
      <ScrollView
        scrollY
        style={{ height: '100%', paddingBottom: '20rpx', boxSizing: 'border-box' }}
      >
        <View className='page-header'>
          <View className='user-info'>
            <SpImage src={userInfo.avatar} mode='aspectFit' width={110} height={110} />
            <Text className='user-name'>{userInfo.username || userInfo.mobile}</Text>
          </View>
        </View>
        <View className='card-block'>
          <View className='card-block-hd'>{$t('fb7ff6e1.2603c1')}</View>
          <View className='card-block-bd padding-20'>
            <View className='tipas'>
              <AtInput
                name='activityName'
                value={activityName}
                className='group-name'
                placeholder={$t('fb7ff6e1.befbc4')}
                onChange={onInputChange.bind(this, 'activityName')}
              />
            </View>
            <View className='tip'>{$t('fb7ff6e1.e53fa1')}</View>

            <View className='teamhead-barcode'>
              <SpUpload
                value={qrcode}
                onChange={(val) => {
                  setState((draft) => {
                    draft.qrcode = val
                  })
                }}
              />
            </View>
            <View className='info-list'>
              {comps?.map((item, index) => (
                <View className='comp-item-wrap' key={`comp-item__${index}`}>
                  <View className='comp-info'>
                    <Text className='comp-name'>{getCompLabel(item)}</Text>
                    <View className='bt-group'>
                      <View
                        className={classNames('btn-text', { disabled: index == 0 })}
                        onClick={handleClickAction.bind(this, item, 'up', index)}
                      >
                        {$t('fb7ff6e1.315eac')}
                      </View>
                      <View
                        className={classNames('btn-text', { disabled: index == comps.length - 1 })}
                        onClick={handleClickAction.bind(this, item, 'down', index)}
                      >
                        {$t('fb7ff6e1.17acd2')}
                      </View>
                      <View
                        className={classNames('btn-text', { disabled: index == 0 })}
                        onClick={handleClickAction.bind(this, item, 'top', index)}
                      >
                        {$t('fb7ff6e1.3d43ff')}
                      </View>
                      <View
                        className='btn-text'
                        onClick={handleClickAction.bind(this, item, 'add', index)}
                      >
                        {$t('fb7ff6e1.b58c75')}
                      </View>
                      <View
                        className='btn-text'
                        onClick={handleClickAction.bind(this, item, 'delete', index)}
                      >
                        {$t('fb7ff6e1.2f4aad')}
                      </View>
                    </View>
                  </View>
                  {item.type == 'bigimage' && <SpImage src={item.value} width={670} />}
                  {item.type == 'text' && (
                    <AtTextarea
                      name={`${item.type}__${index}`}
                      value={item.value}
                      placeholder={$t('fb7ff6e1.19c54d')}
                      count={false}
                      onChange={onTextAreaChange.bind(this, index)}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
          <View className='card-block-ft'>
            {COMPS_LIST.map((item, index) => (
              <View
                className='btn-icon'
                key={`btn-icon__${index}`}
                onClick={onCompsClick.bind(this, item)}
              >
                <Text className={classNames('iconfont', item.icon)}></Text>
                <Text className='btn-icon-txt'>{$t(item.labelKey)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='card-block'>
          <View className='card-block-hd'>
            <Text>{$t('fb7ff6e1.80e092')}</Text>
            <View
              className='btn-import'
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpages/community/itemlist'
                })
              }}
            >
              {$t('fb7ff6e1.8687fa')}
            </View>
          </View>
          <View className='card-block-bd padding-20'>
            <View className='goods-list'>
              {selectGoods.map((item) => (
                <CompGoodsItem info={item} />
              ))}
            </View>
          </View>
        </View>

        <View className='card-block'>
          <View className='card-block-hd'>{$t('fb7ff6e1.9a8425')}</View>
          <View className='card-block-bd'>
            <SpCell
              border
              title={$t('fb7ff6e1.0f71a2')}
              isLink
              onClick={() => {
                Taro.navigateTo({ url: '/subpages/community/picker-community' })
              }}
            >
              {selectCommunityZiti ? (
                <View className='ziti-info'>{selectCommunityZiti.zitiName}</View>
              ) : (
                <View className='ziti-info placeholder'>{$t('fb7ff6e1.0f71a2')}</View>
              )}
            </SpCell>
            {/* <SpCell border title="需要用户填写信息" isLink/> */}

            <SpCell border title={$t('fb7ff6e1.480b70')} isLink>
              <View className='picker-container'>
                <Picker
                  className='date-picker'
                  mode='date'
                  onChange={(e) => {
                    setState((draft) => {
                      draft.startDate = e.detail.value
                    })
                  }}
                >
                  <View className='picker-value'>{startDate || $t('fb7ff6e1.2bebdd')}</View>
                </Picker>
                <Picker
                  className='time-picker'
                  mode='time'
                  onChange={(e) => {
                    setState((draft) => {
                      draft.startTime = e.detail.value
                    })
                  }}
                >
                  <View className='picker-value'>{startTime || $t('fb7ff6e1.2c825a')}</View>
                </Picker>
              </View>
            </SpCell>

            <SpCell border title={$t('fb7ff6e1.70d851')} isLink>
              <View className='picker-container'>
                <Picker
                  className='date-picker'
                  mode='date'
                  onChange={(e) => {
                    setState((draft) => {
                      draft.endDate = e.detail.value
                    })
                  }}
                >
                  <View className='picker-value'>{endDate || $t('fb7ff6e1.2bebdd')}</View>
                </Picker>
                <Picker
                  className='time-picker'
                  mode='time'
                  onChange={(e) => {
                    setState((draft) => {
                      draft.endTime = e.detail.value
                    })
                  }}
                >
                  <View className='picker-value'>{endTime || $t('fb7ff6e1.2c825a')}</View>
                </Picker>
              </View>
            </SpCell>

            {/* <SpCell border title='团购开始时间'>
            <View className='picker-container'>
              <View className="date-picker">
                开始 <SpPicker mode='datetime'/>
                <Text className='at-icon at-icon-chevron-right'></Text>
              </View>
              <View className="date-picker">
                结束 <SpPicker mode='datetime' />
                <Text className='at-icon at-icon-chevron-right'></Text>
              </View>
            </View>
          </SpCell> */}
            {/* <SpCell border title="周围邻居是否可见" isLink/> */}
          </View>
        </View>
        <View className='card-block share'>
          <SpCell title={$t('fb7ff6e1.530ad7')} isLink>
            <Text className='tips'>{$t('fb7ff6e1.472d02')}</Text>
            <SpImage onClick={onChooseClick} src={shareImageUrl} width={100} />
          </SpCell>
        </View>
      </ScrollView>
    </SpPage>
  )
}

Group.options = {
  addGlobalClass: true
}

export default Group
