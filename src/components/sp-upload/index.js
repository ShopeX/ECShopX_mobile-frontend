/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, Video } from '@tarojs/components'
import imgUploader from '@/utils/upload'
import { isArray, authSetting, classNames } from '@/utils'
import { SpImage } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
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
    placeholder
  } = props

  const { i18n } = useTranslation()
  const resolvedPlaceholder = useMemo(
    () => (placeholder !== undefined && placeholder !== null ? placeholder : $t('7c40f12d.b89fb3')),
    [placeholder, i18n.language]
  )

  const [state, setState] = useImmer(initialState)
  const { files } = state

  const showUploadError = (title) => {
    Taro.showToast({
      title: title || $t('0f33692c.02dd40'),
      icon: 'none'
    })
  }

  const isCancelError = (error) => {
    const msg = error?.errMsg || error?.message || ''
    return String(msg).includes('cancel')
  }

  useEffect(() => {
    setState((draft) => {
      draft.files = value || []
    })
  }, [value])

  const applyUploadResult = (res, sourceFiles) => {
    if (!res?.length) {
      showUploadError()
      return
    }
    if (res.length < sourceFiles.length) {
      showUploadError($t('0f33692c.568fe2'))
    }
    const _res = mediaType == 'video' ? res : res.map((item) => item.url)
    const _files = [...files, ..._res]
    setState((draft) => {
      draft.files = _files
    })
    onChange(_files)
  }

  const uploadFiles = async (resultFiles, filetype = 'image') => {
    if (!resultFiles.length) {
      showUploadError($t('0f33692c.a62935'))
      return
    }
    Taro.showLoading({ title: $t('0f33692c.fc09a7') })
    try {
      const res = await imgUploader.uploadImageFn(resultFiles, filetype)
      console.log('---uploadImageFn res---', res)
      applyUploadResult(res, resultFiles)
    } catch (error) {
      console.error('sp-upload upload failed', error)
      showUploadError()
    } finally {
      Taro.hideLoading()
    }
  }

  const handleUploadFile = async () => {
    const remainCount = max - files.length
    if (remainCount <= 0) {
      showUploadError(ti('0f33692c.eb15fc', [max]))
      return
    }
    if (process.env.TARO_ENV == 'h5') {
      try {
        const { tempFiles = [] } = await Taro.chooseImage({
          count: remainCount,
          sourceType: ['camera', 'album']
        })
        console.log('sp-upload handleUploadFile', tempFiles)
        const resultFiles = tempFiles.map((item) => ({
          url: item.path,
          file: item
        }))
        await uploadFiles(resultFiles, 'image')
      } catch (error) {
        if (!isCancelError(error)) {
          console.error('sp-upload chooseImage failed', error)
          showUploadError($t('0f33692c.8f3001'))
        }
      }
    }

    if (process.env.TARO_ENV == 'weapp') {
      authSetting(
        'camera',
        async () => {
          try {
            const { tempFiles = [] } = await Taro.chooseMedia({
              count: remainCount,
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
            await uploadFiles(resultFiles, mediaType == 'video' ? 'videos' : 'image')
          } catch (error) {
            if (!isCancelError(error)) {
              console.error('sp-upload chooseMedia failed', error)
              showUploadError($t('0f33692c.8f3001'))
            }
          }
        },
        () => {
          showUploadError($t('0f33692c.ec9e76'))
        }
      )
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
                {$t('7c40f12d.95b351')}
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
          {!backgroundSrc && <Text className='btn-upload-txt'>{resolvedPlaceholder}</Text>}
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
