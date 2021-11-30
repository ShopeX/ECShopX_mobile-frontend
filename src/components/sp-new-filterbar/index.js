import Taro, { useState, memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils';
import './index.scss';

const SpNewFilterbar = (props) => {

    const {
        filterText = '筛选',
        filterData,
        value,
        onClickLabel
    } = props;

    return (
        <View
            className={classNames('sp-component-newfilterbar')}
        >
            <View className={'sp-component-newfilterbar-check'}>
                {
                    filterData.map(item=>(
                        <View 
                            className={classNames('label',{
                                ['checked']:item.value===value
                            })}
                            onClick={()=>onClickLabel(item)}
                        >
                            {item.label}
                        </View>
                    ))
                }
            </View>
            <View className={'sp-component-newfilterbar-filter'}>
                <View className={'sp-component-newfilterbar-filter-wrapper'}>
                    <View className={'filtertext'}>{filterText}</View>
                    <Text className={'iconfont icon-shaixuan-01'}></Text>
                </View>
            </View>
        </View>
    )
}

export default memo(SpNewFilterbar);