
import React, { Component } from 'react'
import Taro,{getCurrentInstance} from '@tarojs/taro'
import {styleNames, getThemeStyle} from '@/utils'
import { Input, View, Image , MovableArea , MovableView ,Text} from '@tarojs/components'
//import '../../font/iconfont.scss'
import './index.scss'

export default class Make_img extends Component {

  constructor (props) {
    super(props)

    this.state = {
      movearry:[],
      bg_shareImg:'',
      proportion:'',
      imge_id:'',
      indexpages:'',
      imgw:'',
      imgh:''
    }
  }


  componentWillMount () {
    console.log(1,getCurrentInstance())
    let {imgurl , imgurls}=getCurrentInstance().router.params
    console.log("imgurl2",imgurl,imgurls)
    if(imgurl){
      // 首次进入
      imgurl=JSON.parse(imgurl)
      this.setState({
        bg_shareImg:imgurl.imgurl,
        proportion:imgurl.proportion,
        imge_id:imgurl.imge_id
      })
    }
    if(imgurls){
      // 编辑进入

      let ugcwidth=Taro.getSystemInfoSync().windowWidth

      imgurls=JSON.parse(imgurls)
      let {idx,ietms}=imgurls
      console.log("这是编辑",idx,ietms)
      let movearry=ietms.movearry
      movearry.forEach(item => {
        item.x= ( ugcwidth/ietms.ugcwidth )*item.x
        item.y= ( ugcwidth/ietms.ugcwidth )*item.y
      });

      this.setState({
        bg_shareImg:ietms.bg_shareImg,
        movearry:movearry,
        proportion:ietms.proportion,
        indexpages:idx
      })
    }
  }
  // 获取图片宽高
  ongetImageInfo=()=>{
    let that=this
      // 获取图片宽高
      const query = Taro.createSelectorQuery()
      query.select('#dom_img').boundingClientRect( rec => {
        console.log(rec,rec.width,rec.height)
        that.setState({
          imgw:rec.width,
          imgh:rec.height
        })
      }).exec()
  }

  componentDidShow () {
    // wx.enableAlertBeforeUnload({
    //   message: "返回上一页将不会保存该编辑页内容",
    //   success: function (res) {
    //       console.log("成功：", res);
    //   },
    //   fail: function (err) {
    //       console.log("失败：", err);
    //   },
    // });
    // Taro.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })
    let pages = Taro.getCurrentPages();
    let currentPage = pages[pages.length - 1]; // 获取当前页面
    if (currentPage.__data__.label) { // 获取值
      console.log("这是标签页传递的数据",currentPage.__data__.label)
      let label=currentPage.__data__.label
      this.addmovearry(label)
      currentPage.setData({ //清空上一页面传递值
        label:''
      });
    }
  }
  // 跳转
  topages=(url)=>{
    console.log("url",url)
    Taro.navigateTo({ url:url })
  }
  // 增加输入框
  addmovearry(label){
    let {movearry}=this.state
    // 深拷贝防止改变数据后页面不更新
    // movearry=JSON.parse(JSON.stringify(movearry))
    let add={
      value:label,
      x:0,
      y:0,
      than_x:0,
      than_y:0
    }
    movearry.push(add)
    console.log("深拷贝防止改变数据后页面不更新",movearry)
    this.setState({
      movearry
    })
    // Taro.navigateTo({
    //   url:"/mdugc/pages/make_label/index"
    // })
  }

  // 获取更新坐标
  coordinate=(element,ind)=>{
    let {movearry,imgw,imgh}=this.state
    console.log('获取更新坐标',element,ind,movearry)
    let x = element.detail.x;
    let y = element.detail.y;
    let than_x=x/imgw
    let than_y=y/imgh
    movearry[ind].x=x
    movearry[ind].y=y
    movearry[ind].than_x=than_x
    movearry[ind].than_y=than_y
    this.setState({
      movearry
    })
  }
  // 触摸进行中
  debounce = ( wait,immediate,ind,e) => {
    let timeout;
    return  (wait,immediate,ind,e)=> {
      // console.log("进入闭包",e,ind)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
          timeout = null
          if (!immediate) this.coordinate.apply(this, [e,ind])
      }, wait)
      if (immediate && !timeout) this.coordinate.apply(this, [e,ind])
    }
  }
  debounce_ins=this.debounce()

  // 完成
  drawImage=()=>{
    let {movearry,bg_shareImg,indexpages,proportion,imge_id}=this.state
    // 保存屏幕宽度、用于切换屏幕大小时坐标等比例
    let ugcwidth=Taro.getSystemInfoSync().windowWidth
    console.log("屏幕宽度",ugcwidth)

    let imgs={movearry,bg_shareImg,proportion,ugcwidth,imge_id}
    if(indexpages!=='' && indexpages>=0){
      imgs.indexpages=indexpages
    }

    let pages = Taro.getCurrentPages(); // 获取当前的页面栈
    let prevPage = pages[pages.length-2]; // 获取上一页面
    prevPage.setData({ //设置上一个页面的值
      img: imgs
    });
    wx.disableAlertBeforeUnload()
    setTimeout(()=>{
      Taro.navigateBack({
        delta: 1
      })
    },500)
  }

  // 转base64
  fileToBase64 = (filePath) => {
   return new Promise((resolve) => {
      let fileManager = Taro.getFileSystemManager();
      fileManager.readFile({
        filePath,
        encoding: 'base64',
        success: (e) => {
          resolve(`data:image/jpg;base64,${e.data}`);
        }
      });
    });
  }

  // 删除当前标签
  deletetag=(idx)=>{
    let {movearry}=this.state
    movearry.splice(idx,1)
    this.setState({
      movearry
    })
  }

  render () {
    const { movearry , bg_shareImg } = this.state
    return (
      <View className='makeimgindex' style={styleNames(getThemeStyle())}>
        <View className='makeimgindex_title'>
          <Text>点击下方图片或下方按钮添加标签</Text>
        </View>
        <View className='makeimgindex_img'>
          {
            bg_shareImg&&(
              <Image id='dom_img' src={bg_shareImg} mode='widthFix' onload={this.ongetImageInfo.bind(this)} />
            )
          }
          <MovableArea className='MovableArea'>
            {
              movearry.map((element,idx) => {
                return (
                <MovableView
                  style='height: auto; width:auto;'
                  direction='all'
                  x={element.x}
                  y={element.y}
                  className="MovableView"
                  onChange={this.debounce_ins.bind(this,500,false,idx)}
                  animation={false}
                  >
                  <View className='MovableView_i'>
                    {element.value.tag_name}
                    <View className='MovableView_i_icon' onClick={this.deletetag.bind(this,idx)}>
                      <View className='icon-jiahao'></View>
                    </View>
                  </View>
                </MovableView>
                )
              })
            }
          </MovableArea>
        </View>
        <View className='makeimgindex_btn makeimgindex_btn_label' onClick={this.topages.bind(this,"/subpages/mdugc/pages/make_label/index")}>添加标签</View>
        <View className='makeimgindex_btn makeimgindex_btn_complete' onClick={this.drawImage.bind(this)}>确认</View>

      </View>
    )
  }
}
