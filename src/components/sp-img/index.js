/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: img组件
 * @FilePath: /unite-vshop/src/components/sp-img/index.js
 * @Date: 2020-03-04 17:27:15
 * @LastEditors: Arvin
 * @LastEditTime: 2020-10-28 10:13:30
 */
import Taro, { Component } from '@tarojs/taro'
import QnImg from '../qn-img'
import AliYunImg from '../aliyun-img'

export default class SpImg extends Component {

  // static options = {
  //   addGlobalClass: true
  // }

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

    return (
      (STORAGE !== 'ali')
      ? <QnImg
        img-class='img-class'
        src={src}
        mode={mode}
        lazyLoad={lazyLoad}
        qnMode={qnMode}
        onLoad={onLoad}
        onError={onError}
        width={width}
        height={height}
      />
      : <AliYunImg
        img-class='img-class'
        src={src}
        mode={mode}
        lazyLoad={lazyLoad}
        qnMode={qnMode}
        onLoad={onLoad}
        onError={onError}
        width={width}
        height={height}
        m={m}
        l={l}
        s={s}
        limit={limit}
        color={color}
        p={p}
      />
    )
  }
}
