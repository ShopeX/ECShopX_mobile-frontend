/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: img组件
 * @FilePath: /unite-vshop/src/components/sp-img/index.js
 * @Date: 2020-03-04 17:27:15
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-05 16:16:53
 */
import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { h5 } from '../../../config/dev'
// import QnImg from '../qn-img'
// import AliYunImg from '../aliyun-img'

export default class SpImg extends Component {

  static defaultProps = {
    onLoad: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  static externalClasses = ['img-class']

  render () {
    const {
      src,
      mode,
      lazyLoad,
      qnMode,
      onLoad,
      onError,
      width,
      height,
      // 缩放模式
      m,
      // 最长边
      l,
      // 最短边
      s,
      // 大于原图是否处理
      limit,
      // 填充
      color,
      // 按比例
      p
    } = this.props

    if (!src) return null

    let url = src

    if (!qnMode) {
      // 处理阿里云的图片缩放参数
      const mod = m ? `m_${m},` : ''
      const w = width ? `w_${width},` : ''
      const h = height ? `h_${height},` : ''
      const ll = l ? `l_${l},` : ''
      const ss = s ? `s_${s},` : ''
      const lim = limit ? `limit_${limit},` : ''
      const col = color ? `color_${limit},` : ''
      const per = p ? `p_${p},` : ''
      // 是否需要处理
      const isMode = mod || width || height || ll || ss || lim || col || per
      url += isMode ? `?x-oss-process=image/resize,${mod}${w}${h}${ll}${ss}${lim}${col}${per}` : ''
    } else {
      url += qnMode
    }

    const imgClass = Taro.getEnv() !== 'WEB' ? 'img-class' : this.props['img-class']

    return (
      <Image 
        className={imgClass}
        src={url}
        mode={mode}
        onError={onError}
        onLoad={onLoad}
        lazyLoad={lazyLoad}
      />
    )
  }
}
