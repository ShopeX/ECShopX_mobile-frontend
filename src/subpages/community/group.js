import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { SpPage, SpImage, SpButton, SpUpload, SpCell, SpPicker } from '@/components'
import { AtInput, AtTextarea } from 'taro-ui'
import imgUploader from '@/utils/upload'
import { classNames } from '@/utils'
import CompGoodsItem from './comps/comp-goodsitem'
import './group.scss'

const COMPS_LIST = [
  { name: '大图', icon: 'icon-picture', key: 'bigimage' },
  { name: '文字', icon: 'icon-bianji1', key: 'text' }
]

const initialState = {
  list: [],
  comps: [
    {
      type: 'text',
      value: 'test1'
    },
    {
      type: 'bigimage',
      value:
        'https://bbctest.aixue7.com//image/35/2022/04/23/b320911a329439d1bd14cf95f82855437vucLMBZBVdLa0a58b91f4398946fc3e013d639ac7d7.jpg'
    },
    {
      type: 'text',
      value: 'test2'
    }
  ],
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: ''
}
function Group(props) {
  const [state, setState] = useImmer(initialState)
  const { list, comps, startDate, startTime, endDate, endTime } = state
  const savePreview = () => {}

  const releaseGroup = () => {}

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

  return (
    <SpPage
      className='page-community-group'
      renderFooter={
        <View className='btn-group'>
          <SpButton
            resetText='保存并预览'
            confirmText='发布团购'
            onConfirm={savePreview}
            onReset={releaseGroup}
          ></SpButton>
        </View>
      }
    >
      <View className='page-header'>
        <View className='user-info'>
          <SpImage width={120} height={120} />
          <Text className='user-name'>xxx</Text>
        </View>
      </View>
      <View className='card-block'>
        <View className='card-block-hd'>团购介绍</View>
        <View className='card-block-bd'>
          <AtInput className='group-name' placeholder='请输入团购活动标题' />
          <View className='tip'>添加群或个人微信二维码，方便团员取得联系</View>

          <View className='teamhead-barcode'>
            <SpUpload />
          </View>
          <View className='info-list'>
            {comps.map((item, index) => (
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
                {item.type == 'bigimage' && <SpImage src={item.value} width={670} height={670} />}
                {item.type == 'text' && (
                  <AtTextarea value={item.value} placeholder='请输入团购活动内容' count={false} />
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
        <View className='card-block-bd'>
          <View className='goods-list'>
            {[1, 2, 3].map((item) => (
              <CompGoodsItem />
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
          />
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
