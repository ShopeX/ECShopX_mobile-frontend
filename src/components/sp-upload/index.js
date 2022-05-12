import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import imgUploader from '@/utils/upload'
import { isArray } from '@/utils'
import { SpImage } from '@/components'
import './index.scss'

const initialState = {
  files: []
}

function SpUpload(props) {
  const { max, onChange = () => {}, value = [] } = props

  const [state, setState] = useImmer(initialState)
  const { files } = state

  useEffect(() => {
    if (value?.length > 0) {
      setState((draft) => {
        draft.files = value
      })
    }
  }, [value])

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
      const _res = res.map((item) => item.url)
      const _files = [...files, ..._res]
      setState((draft) => {
        draft.files = _files
      })
      onChange(_files)
    })
  }

  const handleDeletePic = (idx) => {
    let newArr = files
    if (newArr.length > 1) {
      newArr = newArr.filter((el, ix) => ix != idx)
    } else {
      setState((draft) => {
        draft.files = []
      })
      newArr = []
    }
    onChange(newArr)
  }

  return (
    <View className='sp-upload'>
      {isArray(files) &&
        files.map((item, index) => (
          <View className='file-item' key={`file-item__${index}`}>
            <SpImage mode='aspectFit' src={item} width={160} height={160} />
            <Text
              className='iconfont icon-guanbi'
              onClick={handleDeletePic.bind(this, index)}
            ></Text>
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
