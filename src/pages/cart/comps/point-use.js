import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtFloatLayout,AtInput,AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { SpCheckbox } from '@/components'
import './point-use.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class PointUse extends Component {
  static defaultProps = {
    isOpened: false,
    disabledPoint:false
  }

  constructor (props) {
    super(props)

    this.state = {
      isOpenRule:false,
      point:null,
      localType:props.type
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.type !== this.props.type) {
      this.setState({
        localType: nextProps.type
      })
    }
  }

  static options = {
    addGlobalClass: true
  }

  handleCancel = () => {
    this.setState({
      localType: this.props.type,
      //point:null
    })
    this.props.onClose()
  }

  handleRuleOpen = () =>{
    this.setState({
      isOpenRule:true
    })
  }

  handleRuleClose = () => {
    this.setState({
      isOpenRule:false
    })
  }
  handlePointChange = (value) =>{
    const { info, defalutPaytype } = this.props
    const max_point = Number(info.max_point)
    if(value >= max_point){
      this.setState({
        localType: info.deduct_point_rule.full_amount ? 'point' : defalutPaytype,
        point:max_point
      })
      return max_point
      
    }
    this.setState({
      point:Number(value) > max_point ? max_point : value,
      localType:info.deduct_point_rule.full_amount 
              ? Number(value) === max_point
              ? 'point' 
              : defalutPaytype 
              : defalutPaytype
    },()=>{
      console.log(this.state.localType)
    })
  }

  handleUseFullAmount = (checked)=>{
    const { info } = this.props
    const { localType } = this.state
    this.setState({
      point:checked ? info.max_point : '',
      disabledPoint: checked ? true : false,
      localType: checked ? 'point' : localType
    })
  }


  handleChange = (point,pay_type) => {
    this.props.onChange(point,pay_type)
  }

  render () {
    const { info,isOpened, loading, colors } = this.props
    const { point, isOpenRule,disabledPoint,localType } = this.state
    if (!info) {
      return null
    }
    const { deduct_point_rule = {} } = info
    return (
      <View>
        <AtFloatLayout
        isOpened={isOpened}
      >
        
        <View className='point-use'>
          <View className='point-use__hd'>
            <Text>积分</Text>
            <Text className='rule-title' onClick={this.handleRuleOpen}>使用规则</Text>
            <View
              className='at-icon at-icon-close'
              onClick={this.handleCancel}
            ></View>
          </View>
          <View className='point-use__bd'>
           <View className='point-item'>
              <View className='point-item__title'>
                  用户可用积分：
              </View>
              <View className='point-item__desc'>
                  {info.user_point}
              </View>
           </View>
           <View className='point-item border'>
              <View className='point-item__title'>
                  本单最大可用积分：
              </View>
              <View className='point-item__desc'>
                  {info.max_point}
              </View>
           </View>
           <View className='point-item'>
              <View className='point-item__title'>
                  请输入抵扣积分
              </View>
              <View className='point-item__desc'>
                <AtInput
                  type='number'
                  title=""
                  value={info.real_use_point ? info.real_use_point < info.point_use ? info.real_use_point : info.point_use : null}
                  //disabled={localType === 'point' ? true :false}
                  onChange={this.handlePointChange.bind(this)}
                />
              </View>
           </View>
   
           {
             deduct_point_rule && deduct_point_rule.full_amount && (info.max_point > 0) && (
              <View className='point-item'>
              <View className='point-item__title'>
              <SpCheckbox
                colors={colors}
                checked={localType === 'point'}
                onChange={this.handleUseFullAmount}
              >
                全额抵扣
              </SpCheckbox>
              </View>
           </View>
             )
           }
          </View>
          <Button
            type='primary'
            className='btn-submit'
            style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};`}
            loading={loading}
            onClick={this.handleChange.bind(this, point,localType)}
          >确定</Button>
        </View>
      </AtFloatLayout>
        <AtModal isOpened={isOpenRule}>
        <AtModalHeader>积分使用规则</AtModalHeader>
        <AtModalContent>
           <View>
            使用条件
           </View>
           <View>
          1.积分支付不得超出订单应付总金额的 {deduct_point_rule.deduct_proportion_limit}%；
           </View>
           <View>
           使用数量
           </View>
           <View>
           1.{deduct_point_rule.deduct_point} 积分抵 1 元；
           </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.handleRuleClose}>我知道了</Button> 
        </AtModalAction>
      </AtModal>
      </View>
     
      
    )
  }
}
