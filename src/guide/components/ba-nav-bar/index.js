import Taro, { Component } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import S from '@/spx'
import './index.scss'

export default class BaNavBar extends Component {
    static options = {
        addGlobalClass: true
    }
    static defaultProps = {
        onClick: () => { }
    }
    constructor (props) {
        super(props)
        this.state = {
          
          navbarHeight:0,
          right:0,
          leftWidth:50,
          titleWidth:100
       
          
        }
    }
    async componentDidMount(){
       let MenuButton= await Taro.getMenuButtonBoundingClientRect()
       console.log('MenuButton---1',MenuButton)
       let systemInfo= await Taro.getSystemInfoSync()
       let MenuButtonH=MenuButton.height
       let MenuButtonT=MenuButton.top
       let MenuButtonW=MenuButton.width
       let right=systemInfo.screenWidth-MenuButton.right
       let statusBarHeight=systemInfo.statusBarHeight
       let navbarHeight=statusBarHeight+MenuButtonH+(MenuButtonT-statusBarHeight)*2+6
       const {leftWidth}=this.state
       let titleWidth=systemInfo.windowWidth-(MenuButtonW+right*2)-leftWidth
       console.log('systemInfo---1',navbarHeight,systemInfo)
   
       this.setState({ 
        navbarHeight,
        right,
        titleWidth
       })
       console.log('navbarHeight',navbarHeight)
        S.set('navbar_height',navbarHeight,true)

    }
    //回退
    navBack() {
        Taro.navigateBack({
          delta: 1
        })      
    }
    //回首页
    navHome(){
        Taro.redirectTo({
            url:'/guide/pages/index'
        }) 
    }
   

    render() {
        const { navbarHeight, right, leftWidth, titleWidth }=this.state
        const {title, fixed, jumpType }=this.props
        if(!navbarHeight) return 
       
        return (
            <View className={classNames('ba-nav-bar',fixed?'ba-nav-bar__fixed':'')} style={styleNames({'height':`${navbarHeight}px`,'line-height':`${navbarHeight}px`,'padding-left':`${right}px`})} >
                <View className='nav-left'  style={styleNames({'width':`${leftWidth}PX`})}>
                    <View className={classNames('icon-sty,icon',jumpType === 'home' ? 'icon-home' : 'icon-arrowDown')} onClick={jumpType=='home'?this.navHome:this.navBack}></View>
                </View>
                
                <View className='ba-nav-bar__title' style={styleNames({'width':`${titleWidth}PX`})}>
                    {title}
                </View>


            </View>


        )
    }
}