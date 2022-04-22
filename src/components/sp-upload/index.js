import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import imgUploader from '@/utils/upload'
import { SpImage } from '@/components'
import './index.scss'

const initialState = {
  files: []
}

function SpUpload(props) {
  const { max } = props

  const [state, setState] = useImmer(initialState)
  const { files } = state

  const handleUploadFile = async () => {
    const { tempFilePaths } = await Taro.chooseImage({
      sourceType: ['camera', 'album'],
      count: 5
    })
    const resultFiles = tempFilePaths.map((item) => ({
      url: item,
      file: item
    }))
    imgUploader.uploadImageFn(resultFiles).then((res) => {
      console.log('---uploadImageFn res---', res)
      setState((draft) => {
        draft.files = [
          ...files,
          ...res
        ]
      })
    })
  }

  return (
    <View className='sp-upload'>
      {files.map((item, index) => (
        <View className='file-item' key={`file-item__${index}`}>
          <SpImage src={item.url} />
        </View>
      ))}
      <View className='btn-upload' onClick={handleUploadFile}>
        <Text className='iconfont icon-plus'></Text>
        <Text className='btn-upload-txt'>添加二维码</Text>
      </View>
    </View>
  )
}

SpUpload.options = {
  addGlobalClass: true
}

export default SpUpload
