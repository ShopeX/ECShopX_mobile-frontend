import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import imgUploader from '@/utils/upload'
import { isArray, authSetting } from '@/utils'
import { SpImage } from '@/components'
import './index.scss'

const initialState = {
  files: []
}

function SpUpload(props) {
  const { max = 5, onChange = () => { }, value = [], multiple = true, mediaType = 'image', edit = false, onEdit = () => { }, placeholder = '添加图片' } = props

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
    authSetting('camera', async () => {
      const { tempFiles, type } = await Taro.chooseMedia({
        count: max,
        mediaType: [mediaType],
        sourceType: ['camera', 'album'],
        camera: 'back',
      })
      console.log('sp-upload handleUploadFile', tempFiles)
      const resultFiles = tempFiles.map(({ tempFilePath, fileType, thumbTempFilePath }) => ({
        url: tempFilePath,
        file: tempFilePath,
        fileType: fileType,
        thumb: thumbTempFilePath
      }))
      Taro.showLoading()
      imgUploader.uploadImageFn(resultFiles, mediaType == 'video' ? 'videos' : 'image').then((res) => {
        console.log('---uploadImageFn res---', res)
        Taro.hideLoading()
        const _res = mediaType == 'video' ? res : res.map((item) => item.url)
        const _files = [...files, ..._res]
        setState((draft) => {
          draft.files = _files
        })
        onChange(_files)
      })
    })

    // const { tempFilePaths } = await Taro.chooseImage({
    //   sourceType: ['camera', 'album'],
    //   count: 5
    // })

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
            <SpImage mode='aspectFit' src={mediaType == 'image' ? item : item.thumb} width={160} height={160} circle={16} />
            <Text
              className='iconfont icon-guanbi'
              onClick={handleDeletePic.bind(this, index)}
            ></Text>
            {edit && <View className='edit-block' onClick={onEdit.bind(this, item, index)}>编辑</View>}
          </View>
        ))}
      {((multiple && files.length < max) || (!multiple && files.length == 0)) && (
        <View className='btn-upload' onClick={handleUploadFile}>
          <Text className='iconfont icon-xiangji'></Text>
          <Text className='btn-upload-txt'>{placeholder}</Text>
          {max && <Text className='files-length'>{`(${files.length}/${max})`}</Text>}
        </View>
      )}
    </View>
  )
}

SpUpload.options = {
  addGlobalClass: true
}

export default SpUpload
