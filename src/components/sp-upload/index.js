// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, Video } from '@tarojs/components'
import imgUploader from '@/utils/upload'
import { isArray, authSetting, classNames } from '@/utils'
import { SpImage } from '@/components'
import './index.scss'

const initialState = {
  files: []
}

function SpUpload(props) {
  const {
    max = 5,
    onChange = () => {},
    value = [],
    multiple = true,
    backgroundSrc = '',
    mediaType = 'image',
    edit = false,
    onEdit = () => {},
    placeholder = '添加图片'
  } = props

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
    if (process.env.TARO_ENV == 'h5') {
      const { tempFiles } = await Taro.chooseImage({
        count: max,
        sourceType: ['camera', 'album']
      })
      console.log('sp-upload handleUploadFile', tempFiles)
      const resultFiles = tempFiles.map((item) => ({
        url: item.path,
        file: item
      }))

      Taro.showLoading()
      // console.log("🚀🚀🚀 ~ file: index.js:93 ~ resultFiles ~ resultFiles:", resultFiles)

      imgUploader.uploadImageFn(resultFiles, 'image').then((res) => {
        // console.log('---uploadImageFn res---', res)
        Taro.hideLoading()
        const _res = mediaType == 'video' ? res : res.map((item) => item.url)
        const _files = [...files, ..._res]
        setState((draft) => {
          draft.files = _files
        })
        onChange(_files)
      })
    }

    if (process.env.TARO_ENV == 'weapp') {
      authSetting('camera', async () => {
        const { tempFiles, type } = await Taro.chooseMedia({
          count: max,
          mediaType: [mediaType],
          sourceType: ['camera', 'album'],
          camera: 'back'
        })
        console.log('sp-upload handleUploadFile', tempFiles)
        const resultFiles = tempFiles.map(({ tempFilePath, fileType, thumbTempFilePath }) => ({
          url: tempFilePath,
          file: tempFilePath,
          fileType: fileType,
          thumb: thumbTempFilePath
        }))
        Taro.showLoading()
        imgUploader
          .uploadImageFn(resultFiles, mediaType == 'video' ? 'videos' : 'image')
          .then((res) => {
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
    }
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
            <SpImage
              mode='aspectFit'
              src={mediaType == 'image' ? item : item.thumb}
              width={160}
              height={160}
              circle={16}
            />
            <Text
              className='iconfont icon-guanbi'
              onClick={handleDeletePic.bind(this, index)}
            ></Text>
            {edit && (
              <View className='edit-block' onClick={onEdit.bind(this, item, index)}>
                编辑
              </View>
            )}
          </View>
        ))}
      {((multiple && files.length < max) || (!multiple && files.length == 0)) && (
        <View className='btn-upload' onClick={handleUploadFile}>
          {backgroundSrc && <SpImage src={backgroundSrc} className='btn-upload-bg' />}
          <View className={classNames('btn-upload-icon', { 'hasBackground': backgroundSrc })}>
            <Text className='iconfont icon-xiangji'></Text>
          </View>
          {!backgroundSrc && <Text className='btn-upload-txt'>{placeholder}</Text>}
          {!backgroundSrc && max && (
            <Text className='files-length'>{`(${files.length}/${max})`}</Text>
          )}
        </View>
      )}
    </View>
  )
}

SpUpload.options = {
  addGlobalClass: true
}

export default SpUpload
