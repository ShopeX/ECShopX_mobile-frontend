import Taro, { Component } from '@tarojs/taro'
import { View, Form, Text } from '@tarojs/components'
import { AtInput, AtSwitch, AtButton } from 'taro-ui'
import { SpToast, NavBar, TimePicker } from '@/components'
import { classNames, isString } from '@/utils'
import S from '@/spx'
import api from '@/api'

import './reg.scss'

const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP


export default class StoreReg extends Component {
    constructor(props) {
        super(props)

        this.state = {
            time:['',''],
            info: {
                is_delivery:true,
                is_ziti:false,
            },

        }
       
    }

    componentDidMount() {

    }



    async fetch() {
        let arr = []
        let res = await api.user.storeReg()
        console.log(res)

    }
    handleChange=(name,val)=>{
     
        if(name!=='is_delivery'&&name!=='is_ziti'){
            val=val&&isString(val)&&val.replace(/\s/g,'')
        }

        const {info}=this.state
        info[name]=val
        this.setState({
            info
        })
        
    }
    handleTime=(index,val)=>{
        const {time}=this.state
        time[index]=val
        this.setState({
            time
        })
     
    }
    handleSubmit = async () => {
       
        const data = {
            ...this.state.info,
            hour:this.state.time
           
        }
        if (!data.name) {
            return S.toast('请输入店铺名称')
        }
        if (!data.mobile || !/1\d{10}/.test(data.mobile)) {
            return S.toast('请输入正确的手机号')
        }
        if (!data.contact) {
            return S.toast('请输入联系人')
        }
        if (!data.hour[0]) {
            return S.toast('请选择开始时间')
        }
        if (!data.hour[1]) {
            return S.toast('请选择结算时间')
        }
        if(data.hour[0]>=data.hour[1]){
            return S.toast('开始时间不能大于等于结束时间')
        }
        data.hour=data.hour[0]+'-'+data.hour[1]
       
        let res = await api.user.storeReg(data)
        S.toast('提交成功')
    }
    render() {

        const { info,time } = this.state

        return (
            <View className='auth-reg'>
                <NavBar
                    title='申请店铺入驻'
                    leftIconType='chevron-left'
                />
                <Form
                    
                >
                    <View className='sec auth-reg__form'>
                        <View className='store-reg__input'>
                            <AtInput
                                title='店铺名称'
                                name='name'
                                value={info.name}
                                placeholder='请输入店铺名称'
                                onChange={(e)=>this.handleChange('name',e)}
                            />
                            <AtInput
                                title='联系人手机号'
                                name='mobile'
                                type='number'
                                maxLength={11}
                                value={info.mobile}
                                placeholder='请输入联系人手机号'
                                onChange={(e)=>this.handleChange('mobile',e)}
                            />
                            <AtInput
                                title='联系人'
                                name='contact'
                                value={info.contact}
                                maxLength={10}
                                placeholder='请输入联系人'
                                onChange={(e)=>this.handleChange('contact',e)}
                            />
                            <View className='store-reg_time at-input'>
                                <Text className='at-input__title'>营业时间</Text>
                            <TimePicker onselctedTime={this.handleTime.bind(this,0)}>
                                
                                <Text className={classNames(!time[0]?'store-reg_time-placeholder':'')}>{time[0]?time[0]:'开始时间'}</Text>
                                <Text className={classNames(!time[0]?'store-reg_time-placeholder':'')}>-</Text>
                
                            </TimePicker>
                            <TimePicker onselctedTime={this.handleTime.bind(this,1)}>
                                <Text className={classNames(!time[1]?'store-reg_time-placeholder':'')}>{time[1]?time[1]:'结束时间'}</Text>
                            </TimePicker>
                            </View>

                            <AtSwitch title='支持快递' checked={info.is_delivery} onChange={(e) => this.handleChange('is_delivery',e)} />
                            <AtSwitch title='支持自提' checked={info.is_ziti} onChange={(e) => this.handleChange('is_ziti',e)} />


                        </View>
                        <View className='store-reg__btn'>
                            <AtButton onClick={this.handleSubmit}>提交</AtButton>
                        </View>


                    </View>

                </Form>

                <SpToast />
            </View>
        )
    }
}
