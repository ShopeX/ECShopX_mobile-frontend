/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 轮播/视频封面：无手动封面时，对阿里云 OSS 视频取首帧，避免前台黑屏。
 */

/**
 * @param {string} [coverUrl] 手动配置的封面
 * @param {string} [videoUrl] 视频地址
 * @returns {string}
 */
export function getVideoPoster(coverUrl, videoUrl) {
  if (coverUrl) return coverUrl
  if (!videoUrl || typeof videoUrl !== 'string') return ''
  // 已带处理参数则不再拼接
  if (/[?&]x-oss-process=/.test(videoUrl)) return ''
  // 阿里云 OSS 视频截帧（约 1s，避免 t_0 黑帧）；w_750 控制体积，展示侧用 cover 铺满
  if (/\.aliyuncs\.com|\.oss-cn-|oss-accelerate/.test(videoUrl)) {
    const sep = videoUrl.includes('?') ? '&' : '?'
    return `${videoUrl}${sep}x-oss-process=video/snapshot,t_1000,f_jpg,w_750,h_0,m_fast`
  }
  return ''
}
