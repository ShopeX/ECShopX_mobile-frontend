import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Navigator, Form, Button } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import S from '@/spx'
import { connect } from '@tarojs/redux'
import { NavBar, SpToast } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'

import './index.scss'
import './verified.scss'
@connect(({ colors }) => ({
    colors: colors.current
}))

export default class DistributionDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {},
            isTrue: false,
        }
    }
    config = {
        navigationBarTitleText: '实名认证'
    }
    componentDidMount () {
        const { colors } = this.props
        Taro.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: colors.data[0].marketing
        })
        this.fetch()
    }

    handleInput (type, val) {
        let info = this.state.info
        info[type] = val

        this.setState({
            info
        })
    }

    handleSubmit (e) {
        let { info } = this.state
        if (!info.user_name) {
            return S.toast('请输入真实姓名')
        }
        if (!info.id_card || !/^(\d{18,18}|\d{15,15}|\d{17,17}X)$/.test(info.id_card)) {
            return S.toast('请输入正确的身份证号码')
        }
        if (!info.user_mobile || !/1\d{10}/.test(info.user_mobile)) {
            return S.toast('请输入正确的手机号')
        }
        let obj = {
            user_name: info.user_name,
            id_card: info.id_card,
            user_mobile: info.user_mobile
        }
        api.member.hfpayApplySave(obj).then(res => {
            Taro.showToast({
                title: '提交成功等待审核',
                icon: 'success',
                duration: 2000
              })
            this.setState({
                isTrue: true
            })
        })


    }
 




    async fetch () {
        const res = await api.member.hfpayUserApply()
        const info = pickBy(res, {
            user_name: 'user_name',
            id_card: 'id_card',
            user_mobile: 'user_mobile',
            status: 'status',
        })
        if (info.status == 3) {

            this.setState({
                info, isTrue: true
            })
        }
        // const info = { username, avatar, ...pInfo }


    }

    render () {
        const { colors } = this.props
        const { info, isTrue } = this.state

        return (
            <View className='page-distribution-index'>
                <NavBar
                    title='实名认证'
                    leftIconType='chevron-left'
                />

                <View className="page-bd">
                    <Form
                        onSubmit={this.handleSubmit}
                    >
                        <View className=''>
                            <View className=''>

                                <AtInput
                                    disabled={isTrue}
                                    title='姓名'
                                    type='text' placeholder='姓名'
                                    value={info.user_name}
                                    onChange={this.handleInput.bind(this, 'user_name')} />

                            </View>
                            <View className=''>
                                <AtInput
                                    title='身份证'
                                    disabled={isTrue}
                                    type='idcard'
                                    placeholder='身份证号码'
                                    value={info.id_card}
                                    onChange={this.handleInput.bind(this, 'id_card')}
                                />
                            </View>
                            <View className=''>
                                <AtInput

                                    disabled={isTrue}
                                    title='手机号码'
                                    type='user_mobile'
                                    placeholder='手机号码'
                                    value={info.user_mobile}
                                    onChange={this.handleInput.bind(this, 'user_mobile')}
                                />
                            </View>
                        </View>
                        <View>
                            {process.env.TARO_ENV === 'weapp'
                                ? <View>
                                    <Button
                                        className='submit-btn'
                                        type='primary'
                                        formType='submit'
                                        disabled={isTrue}
                                        style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                                    >提交</Button>
                                </View>
                                : <Button
                                    type='primary'
                                    disabled={isTrue}
                                    onClick={this.handleSubmit}
                                    formType='submit'
                                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                                >提交</Button>
                            }
                            <SpToast />
                        </View>
                    </Form>
                </View>
            </View>
        )
    }
}
