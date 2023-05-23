import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { classNames } from '@/utils'

import './comp-tags-barcheck.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class TagsBarcheck extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    current: [],
    list: []
  }

  constructor (props) {
    super(props)

    this.state = {
      curId:[]
    }
  }
  componentWillReceiveProps(nextProps){
    const { current } = nextProps
    console.log(123,current)
    this.setState({
      curId:current
    })
  }
  handleClickItem (id) {
    this.props.onChange(id)
  }

  render () {
    const { list } = this.props
    const {curId}=this.state
    return (
      <ScrollView
        className='tags'
        scrollX
      >
        {
          list.length > 0 &&
          list.map((item, idx) => {
            return (
              <View
                className={` ${(curId?.filter( curIdi=> (curIdi==item.topic_id))).length>0?"tag-item_active":""} tag-item `}
                onClick={this.handleClickItem.bind(this, item.topic_id)}
                key={item.topic_id}
              >
                {item.topic_name}
              </View>
            )
          })
        }
      </ScrollView>
    )
  }
}
