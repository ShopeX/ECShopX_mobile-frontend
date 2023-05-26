import React, { useEffect, useRef, useState } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { pickBy } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'
import imgUploader from '@/utils/upload'
import { AtInput, AtTextarea, AtActionSheet, AtActionSheetItem, AtButton } from 'taro-ui'
import { View, Text, Block } from '@tarojs/components'
import { SpPage, SpSearchBar, SpScrollView, SpCell, SpNote } from '@/components'
import { showToast } from '@/utils'

import './subject-talk.scss'

const initialState = {
  keyword: '',
  list: []
}

function UgcSubjectTalk(props) {
  const [state, setState] = useImmer(initialState)
  const [selected, setSelected] = useState(new Map())
  const { keyword, list } = state
  const { userInfo = {} } = useSelector((state) => state.user)
  const listRef = useRef()

  // const selected = new Set()

  useEffect(() => {
    listRef.current.reset()
  }, [keyword])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      topic_name: keyword
    }
    const { list = [], total_count: total } = await api.mdugc.topiclist(params)
    setState(draft => {
      draft.list = pickBy(list, {
        topicId: "topic_id",
        topicName: "topic_name"
      })
    })
    return { total: total || 0 }
  }

  const handleAddSubjectTalk = async () => {
    const { topic_name, topic_id, message, status } = await api.mdugc.topiccreate({
      user_id: userInfo.user_id,
      topic_name: keyword
    })
    // debugger
    // if (status == 1) {
    //   this.topages({ topic_name, topic_id })
    // }
    showToast('添加成功')
    listRef.current.reset()
  }

  const handleClickItem = ({ topicId, topicName }) => {
    let tempSelected
    if (selected.has(topicId)) {
      selected.delete(topicId)
      tempSelected = new Map([...selected])
    } else {
      tempSelected = new Map([...selected, [topicId, { topicId, topicName }]])
    }
    Taro.eventCenter.trigger('onEventSubjectTalk', Array.from(tempSelected.values()))
    setSelected(tempSelected);
  }

  const isChecked = ({ topicId }) => {
    return selected.has(topicId) ? <Text className="iconfont icon-zhengque-correct"></Text> : null
  }


  const handleOnClear = async () => {
    await setState((draft) => {
      draft.keyword = ''
      draft.list = []
    })
  }

  const handleSearchCancel = () => {
    setState((draft) => {
      draft.keyword = ''
      draft.list = []
    })
  }

  const handleConfirm = async (val) => {
    await setState((draft) => {
      draft.keyword = val
      draft.list = []
    })
  }

  return (
    <SpPage className='page-ugc-subject-talk'>
      <SpSearchBar
        keyword={keyword}
        placeholder='搜索话题'
        localStorageKey='ugcSubjectTalkHistory'
        onFocus={() => { }}
        onChange={() => { }}
        onClear={handleOnClear}
        onCancel={handleSearchCancel}
        onConfirm={handleConfirm}
      />

      <SpScrollView
        className='list-scroll'
        ref={listRef}
        fetch={fetch}
        renderEmpty={
          <View className='action-container'>
            <SpNote icon title='没有查询到数据' />
            {keyword && <AtButton circle onClick={handleAddSubjectTalk}>添加自定义话题</AtButton>}
          </View>
        }
      >
        {list.length > 0 && <View className='list-container'>
          {
            list.map((item, index) => (
              <SpCell className='subject-item' key={`subject-item__${index}`}
                title={item.topicName}
                border={index < list.length - 1}
                value={isChecked(item)}
                onClick={handleClickItem.bind(this, item)} />
            ))
          }
        </View>
        }
      </SpScrollView>
    </SpPage>
  )
}

export default UgcSubjectTalk
