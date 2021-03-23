import Taro, { Component } from '@tarojs/taro'
import { View, Text,Input } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

export default class BaStoreList extends Component {
  static options = {
    addGlobalClass: true
  }


  static defaultProps = {
    currentIndex:0,
   
  }
  constructor(props) {
    super(props)
    this.state = {
        keyWord:'',
        
    }
}
  handleClick=(index)=>{
    console.log('handleClick------999',index)
    const {onChangeCurIndex}=this.props
   
    onChangeCurIndex(index)
   
     
  }
  hanldeConfirm=()=>{
      const {keyWord}=this.state
     
      const {onSearchStore,onChangeCurIndex}=this.props
      onSearchStore({shop_name:keyWord})
      onChangeCurIndex(0)
      // onChangeCurIndex(0)
      // // this.setState({
      // //   currentIndex:0
      // // })
  }
  hanldeInput=(e)=>{
    const {detail:{value}}=e
      this.setState({
        keyWord:value
      })
  }

  handleReset=()=>{
    //   debugger
      this.setState({
          keyWord:''
      })
  }
  hanldeStore=()=>{

    const {onStoreConfirm}=this.props
    onStoreConfirm()
    
  }

 
 

  render () {
    const {shopList,currentIndex} = this.props
    const {keyWord}=this.state
    if(!shopList) return
    return (
      <View className='mask'>
        <View
            className='ba-store-list'
        >
            <View className='store-head'>
                <View className='store-head__strname'>切换门店</View>
                
                <Text className='in-icon in-icon-close' onClick={()=>this.props.onClose(false)}></Text>
            </View>
            <Input className='store-search' value={keyWord} type='text' placeholder='搜索门店' onConfirm={this.hanldeConfirm} onInput={this.hanldeInput}/>
            <View className='store-main'>
                {shopList.map((item,index)=>{
                    return(
                    <View className='store-item' key='index' onClick={this.handleClick.bind(this,index)}>
                        <View className={classNames('store-item__name',currentIndex===index?'active':'')} >{item.wxshop_name}</View>
                        
                    </View>
                    )
                })}
            
            
            
            </View>
            <View className='store-ft'>
                <View className='btn reset_btn' onClick={this.handleReset}>重置</View>
                <View className='btn confirm_btn' onClick={this.hanldeStore}>确定</View>
            </View>
       
      </View>
    </View>
     
    )
  }
}
