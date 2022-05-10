import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { SpPage, SpImage, SpButton, SpUpload, SpCell, SpPicker } from '@/components'
import { AtButton, AtInput, AtTextarea } from 'taro-ui'
import imgUploader from '@/utils/upload'
import { classNames, showToast, pickBy } from '@/utils'
import api from '@/api'
import doc from '@/doc'
import { updateSelectGoods, updateSelectCommunityZiti } from '@/store/slices/community'
import dayjs from 'dayjs'
import CompGoodsItem from './comps/comp-goodsitem'
import './group.scss'

const COMPS_LIST = [
  { name: '大图', icon: 'icon-picture', key: 'bigimage' },
  { name: '文字', icon: 'icon-bianji1', key: 'text' }
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
  endTime: ''
}
function Group(props) {
  const [state, setState] = useImmer(initialState)
  const { userInfo = {} } = useSelector((state) => state.user)
  const { selectCommunityZiti, selectGoods } = useSelector((state) => state.community)
  const { qrcode, activityName, comps, startDate, startTime, endDate, endTime } = state
  const dispatch = useDispatch()
  const $instance = getCurrentInstance()

  useEffect(() => {
    if ($instance.router.params.id) {
      fetchActivity()
    }
  }, [])

  const fetchActivity = async () => {
    const res = await api.community.getChiefActivity($instance.router.params.id)
    console.log('fetchDetail:', pickBy(res, doc.community.COMMUNITY_ACTIVITY_ITEM))
    const { activityIntro, activityName, activityPics, startTime, endTime } = pickBy(
      res,
      doc.community.COMMUNITY_ACTIVITY_ITEM
    )
    // const _items = pickBy(res.items, doc.community.COMMUNITY_GOODS_ITEM)
    setState((draft) => {
      draft.comps = activityIntro
      draft.qrcode = activityPics
      draft.activityName = activityName
      // draft.goodsList = _items
      draft.startDate = dayjs(startTime * 1000).format('YYYY-MM-DD')
      draft.startTime = dayjs(startTime * 1000).format('HH:mm')
      draft.endDate = dayjs(endTime * 1000).format('YYYY-MM-DD')
      draft.endTime = dayjs(endTime * 1000).format('HH:mm')
    })

    const _ziti = pickBy(res.ziti[0], doc.community.COMMUNITY_ZITI)
    dispatch(updateSelectCommunityZiti(_ziti))

    const selectGoods = _items.map(item => item.itemId)
    dispatch(updateSelectGoods(selectGoods))
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

  const getCompName = ({ type }) => {
    const res = COMPS_LIST.find((item) => item.key == type)
    return res.name
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
          content: '请确认是否删除'
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
      return showToast('请填写团购活动标题')
    }

    // if (qrcode.length == 0) {
    //   return showToast('请上传团长个人微信二维码')
    // }

    const comp = comps.find((item) => !item.value)
    if (comp) {
      if (comp.type == 'text') {
        return showToast('请输入团购活动内容')
      }
      if (comp.type == 'bigimage') {
        return showToast('请添加团购活动图片')
      }
    }

    if(selectGoods.length == 0) {
      return showToast('请选择团购商品')
    }

    if (!selectCommunityZiti) {
      return showToast('请选择自提地址')
    }

    if (!startDate || !startTime) {
      return showToast('请输入团购开始时间')
    }

    if (!endDate || !endTime) {
      return showToast('请输入团购结束时间')
    }

    const params = {
      activity_name: activityName,
      activity_pics: qrcode,
      activity_intro: JSON.stringify(comps),
      items: selectGoods.map((item) => item.itemId),
      ziti: selectCommunityZiti.id,
      start_time: `${startDate} ${startTime}`,
      end_time: `${endDate} ${endTime}`
    }
    let cur_id = $instance.router.params.id
    let act_id
    // 修改活动
    if (cur_id) {
      await api.community.modiflyChiefActivity(cur_id, params)
      act_id = cur_id
    } else {
      const { activity_id } = await api.community.createChiefActivity(params)
      act_id = activity_id
    }

    dispatch(updateSelectGoods([]))
    dispatch(updateSelectCommunityZiti(null))
    showToast(cur_id ? '活动修改成功' : '活动添加成功')
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

  return (
    <SpPage
      className='page-community-group'
      renderFooter={
        <View className='btn-group'>
          <AtButton circle type='primary' onClick={createChiefActivity}>
            发布团购
          </AtButton>
        </View>
      }
    >
      <View className='page-header'>
        <View className='user-info'>
          <SpImage src={userInfo.avatar} mode='aspectFit' width={110} height={110} />
          <Text className='user-name'>{userInfo.username || userInfo.mobile}</Text>
        </View>
      </View>
      <View className='card-block'>
        <View className='card-block-hd'>团购介绍</View>
        <View className='card-block-bd padding-20'>
          <AtInput
            name='activityName'
            value={activityName}
            className='group-name'
            placeholder='请输入团购活动标题'
            onChange={onInputChange.bind(this, 'activityName')}
          />
          <View className='tip'>添加群或个人微信二维码，方便团员取得联系</View>

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
                  <Text className='comp-name'>{getCompName(item)}</Text>
                  <View className='bt-group'>
                    <View
                      className={classNames('btn-text', { disabled: index == 0 })}
                      onClick={handleClickAction.bind(this, item, 'up', index)}
                    >
                      上移
                    </View>
                    <View
                      className={classNames('btn-text', { disabled: index == comps.length - 1 })}
                      onClick={handleClickAction.bind(this, item, 'down', index)}
                    >
                      下移
                    </View>
                    <View
                      className={classNames('btn-text', { disabled: index == 0 })}
                      onClick={handleClickAction.bind(this, item, 'top', index)}
                    >
                      置顶
                    </View>
                    <View
                      className='btn-text'
                      onClick={handleClickAction.bind(this, item, 'add', index)}
                    >
                      添加
                    </View>
                    <View
                      className='btn-text'
                      onClick={handleClickAction.bind(this, item, 'delete', index)}
                    >
                      删除
                    </View>
                  </View>
                </View>
                {item.type == 'bigimage' && <SpImage src={item.value} width={670} />}
                {item.type == 'text' && (
                  <AtTextarea
                    name={`${item.type}__${index}`}
                    value={item.value}
                    placeholder='请输入团购活动内容'
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
              <Text className='btn-icon-txt'>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='card-block'>
        <View className='card-block-hd'>
          <Text>团购商品</Text>
          <View
            className='btn-import'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpages/community/itemlist'
              })
            }}
          >
            选品
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
        <View className='card-block-hd'>团购设置</View>
        <View className='card-block-bd'>
          <SpCell
            border
            title='选择服务小区'
            isLink
            onClick={() => {
              Taro.navigateTo({ url: '/subpages/community/picker-community' })
            }}
          >
            {selectCommunityZiti ? (
              <View className='ziti-info'>{selectCommunityZiti.zitiName}</View>
            ) : (
              <View className='ziti-info placeholder'>选择服务小区</View>
            )}
          </SpCell>
          {/* <SpCell border title="需要用户填写信息" isLink/> */}

          <SpCell border title='团购开始时间' isLink>
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
                <View className='picker-value'>{startDate || '选择日期'}</View>
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
                <View className='picker-value'>{startTime || '选择时间'}</View>
              </Picker>
            </View>
          </SpCell>

          <SpCell border title='团购结束时间' isLink>
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
                <View className='picker-value'>{endDate || '选择日期'}</View>
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
                <View className='picker-value'>{endTime || '选择时间'}</View>
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
    </SpPage>
  )
}

Group.options = {
  addGlobalClass: true
}

export default Group
