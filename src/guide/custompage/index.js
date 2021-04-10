import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView,Button} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast,  Loading, SpNote,SpMenuBtn} from '@/components'
import req from '@/api/req'
import {guideTracker } from '@/service' //埋点
import { pickBy,styleNames,paramsSplice,classNames } from '@/utils'
import entry from '@/utils/entry'
import { withPager, withBackToTop } from '@/hocs'
import S from "@/spx"
import { WgtSearchHome,WgtScrollInput,WgtFixedInput} from '../components/wgts'
import { BaHomeWgts,BaGoodsBuyPanel} from '../components'

import '../../pages/home/index.scss'
import './index.scss'
@connect(store => ({
  store,
  favs: store.member.favs,
  homesearchfocus:store.home.homesearchfocus,
  scrollTop:store.home.custompageScrollTop,
  showBuyPanel:store.cart.showBuyPanel,
  goodsSkuInfo:store.cart.goodsSkuInfo
 
  
}), (dispatch) => ({
  onCloseCart:(item) => dispatch({ type: 'cart/closeCart', payload: item }),
 
}))
@withPager
@withBackToTop()


export default class CustomPage extends Component {
  config = {
    navigationBarTitleText: 'innisfree 导购商城'
  }
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      wgts: null,
      authStatus: false,
      isShowAddTip: false,
      background:null,
      homepopupHostInfo:null,
      scrollInputConfig:{},
      isOpenStore:true,
      isinputfix:false,
      homepopuptimer:null,
      version:null,
      page_id:null,
      scrollPageHeight:0,
      entry_form:null,
      pageShareUrl:null,
      pageinfo:{}
    
     
      
    }
  }

  componentDidShow = () => {
    let  entry_form=S.get('entry_form',true)
    Taro.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // if(entry_form&&['single_chat_tools','group_chat_tools'].includes(entry_form.entry)){
    //  Taro.hideShareMenu({
    //     menus: ['shareAppMessage', 'shareTimeline']
    //   })
    // }
    this.setState({
      entry_form
    })

  
    
  }


  async componentDidMount () {
 
 
    const options = this.$router.params
    const res = await entry.entryLaunch(options, false)
    let version=res.version
    let page_id=res.page_id
    this.setState({
      version,
      page_id
    },()=>{
      this.innitPageShareUrl()
    })

   
    this.fetchInfo(version,page_id)
    
  }
  onShareAppMessage(){
    const {pageShareUrl,pageinfo:{description,page_pic_url}}=this.state
    // let ba_params=S.get('ba_params',true)
    // guideTracker.dispatch('pageShare',{
    //   event_type:'分享自定义页面',
    //   event_id:ba_params.guide_code,
    //   user_type:'企业微信用户',
    //   path:this.$router
    // })
    return {
      title: description,
      path: pageShareUrl,
      imageUrl:page_pic_url
    }
  }
  innitPageShareUrl(){

    const {version,page_id,entry_form}=this.state
    let gu=null
    let url = ''
    let ba_params=S.get('ba_params',true)
    let qw_chatId=S.get('qw_chatId',true)
    let share_params={
      version,
      page_id
    }

    if(ba_params){
      let store_code=ba_params.store_code
      let guide_code=ba_params.guide_code
      gu=guide_code+`${store_code?'_'+store_code:''}`
      share_params.gu=gu
     
    }
    if(qw_chatId){
      share_params.share_chatId=qw_chatId
    }
    if(entry_form){
      share_params.entrySource=entry_form.entry
    }
    let p_str=paramsSplice(share_params)
     
    url=`/subpage/home/custompage?${p_str}`
    console.log('url======url',url)
    if(entry_form&&['single_chat_tools','group_chat_tools'].includes(entry_form.entry)){
      url=`/subpage/home/custompage.html?${p_str}`
    }
    
    this.setState({
      pageShareUrl:url
    })
    
  
  }
 

   hanldeShareMessage= ()=> {
    this.getShareMessage()
   
  }

  async getShareMessage(){
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    const {pageShareUrl,pageinfo:{description,page_pic_url}}=this.state
  
    let ba_params=S.get('ba_params',true)
  
  
    try{
      wx.qy.sendChatMessage({
        msgtype:'miniprogram',
        miniprogram:{
          appid:extConfig.appid,
          title:description,
          imgUrl:page_pic_url||'https://bbc-espier-images.amorepacific.com.cn/2/2019/06/11/54725ab18fba2b27e0c1663b2c8387f24222ec26',
          page:pageShareUrl
        },
        success:()=>{
          // guideTracker.dispatch('pageShare',{
          //   event_type:'分享自定义页面',
          //   event_id:ba_params.guide_code,
          //   user_type:'企业微信用户',
          //   path:this.$router
          // })
        }
  
      })
   
    }catch(err){
      console.log(err)
    }
  
    
  }

  async fetchInfo (version='',page_id='') {
    const url = `/pageparams/setting?template_name=yykweishopamore&version=${version}&page_id=${page_id}&page_name=custom`
    const info = await req.get(url)

    if (!S.getAuthToken()) {
      this.setState({
        authStatus: true
      })
    }

    const bkg_item = info.config.find(item => item.name === 'background' && item.config.background)
  
 
    const slider=info.config.find(item => (item.name === 'slider'||item.name==='slider-hotzone') && item.config.isOpenStore) || null
    const isOpenStore=slider&&slider.config.isOpenStore
    const {dispatch}=this.props
    const scrollInputConfig = info.config.find(item => item.name === 'scroll_input' && item)
   

    let tagnavIndex=-1
    info.config.forEach((wgt_item)=>{
       if(wgt_item.name==='tagNavigation'){
        tagnavIndex++
         wgt_item.tagnavIndex=tagnavIndex
       }
    })
   
    this.setState({
      wgts: info.config,
     
      background:bkg_item && bkg_item.config.background || null,
      scrollInputConfig,
      isOpenStore,
      pageinfo:info.pageinfo
      

    })
  }

  handleCloseCart=()=>{
    setTimeout(()=>{
 
      const {onCloseCart}=this.props
      onCloseCart(false)
    },0)

  }
  handlePageScroll=(top)=>{
    const {scrollPageHeight,scrollTop}=this.state
    let offsetTop=scrollPageHeight+top
    if(offsetTop===scrollTop){
      offsetTop=offsetTop-1
    }
    this.setState({
      scrollTop:offsetTop
    })
  }

  componentDidHide(){
    
  }
 
  
  render () {
    const { wgts,background, page, scrollTop,scrollInputConfig,isOpenStore,scrollflag,entry_form} = this.state
    const isLoading = !wgts || !this.props.store
    const {homesearchfocus,showBuyPanel,goodsSkuInfo}=this.props
    const ipxClass = S.get('ipxClass')
   

    return (
      <View 
        className={classNames('custom-page',!isLoading ? 'page-index' : '')} 
        >
        
        {
          isLoading
            ? <Loading></Loading>
            : (
              <ScrollView
                className={`wgts-wrap wgts-wrap__customfixed`}
                scrollTop={scrollTop}
                onScroll={this.handleHomeScroll}
                scrollY
                style={styleNames(background ? { background: background } : null)}
       
                
              >
                <View className='wgts-wrap__cont'>
             
                  <BaHomeWgts
                    wgts={wgts}
                    source='custompage'
                    onChangPageScroll={this.handlePageScroll}
                  
                  />
                  
                   {(scrollInputConfig.config&&scrollInputConfig.config.isOpen)&&<WgtScrollInput  info={scrollInputConfig} scrollflag={scrollflag}  isOpenStore={isOpenStore}  />}
                   
                 
               
                </View>
          
              </ScrollView>
           
             
            )
        }
        {(scrollInputConfig.config&&scrollInputConfig.config.isOpen&&scrollInputConfig.config.isScroll)&&<WgtFixedInput   info={scrollInputConfig} scrollflag={scrollflag} />}
        
        {homesearchfocus&&<WgtSearchHome isShow={homesearchfocus}  />}
        <View className={`customer__bar ${ipxClass}`}>
          {entry_form&&['single_chat_tools','group_chat_tools'].includes(entry_form.entry)? <Button onClick={this.hanldeShareMessage} className='share-customer'> 分享给顾客</Button>: <Button  open-type='share' className='share-customer'> 分享给顾客</Button>}
         
       </View>

        <SpToast />
       

       
        {showBuyPanel&&<BaGoodsBuyPanel
          info={goodsSkuInfo}
          type='cart'
          isOpened={showBuyPanel}
          onClose={this.handleCloseCart}
          onAddCart={this.handleCloseCart}
           
        />}
       
      </View>
    )
  }
}
