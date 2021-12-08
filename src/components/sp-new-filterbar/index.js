import Taro, { useState, memo } from '@tarojs/taro';
import { View,Text } from '@tarojs/components';
import { classNames } from '@/utils';
import './index.scss';

const SpNewFilterbar = (props) => {

    const {
        filterText = '筛选',
        filterData=[],
        value,
        onClickLabel=()=>{},
        onClickFilter=()=>{},
        bgWhite=true,
        borderRadius=false
    } = props;

    //默认是升序
    const [ plus,setPlus ]=useState(true);

    const isChecked=(item)=>{
        return item.value===value || item.plusValue===value || item.minusValue===value;
    }

    const handleClickLabel=(item)=>{ 
        const sortFunc=(item)=>{
            if(item.value||item.value==0){
                res=item.value
            }else{
                if(plus){
                    res=item.minusValue
                }else{
                    res=item.plusValue
                }
            } 
        }
        let res=0;
        //如果是选中的
        if(isChecked(item)){
            sortFunc(item)
        }else{
            sortFunc(item)
        }
        setPlus(!plus);
        onClickLabel(res)
    }

    return (
        <View
            className={classNames('sp-component-newfilterbar',{
                ['bg-white']:bgWhite,
                ['border-radius']:borderRadius,
            })}
        >
            <View className={'sp-component-newfilterbar-check'}>
                {
                    filterData.map(item=>(
                        <View 
                            className={classNames('label',{
                                ['checked']:isChecked(item)
                            })}
                            onClick={()=>handleClickLabel(item)}
                        >
                            {item.label}
                        </View>
                    ))
                }
            </View>
            <View className={'sp-component-newfilterbar-filter'}>
                <View className={'sp-component-newfilterbar-filter-wrapper'} onClick={onClickFilter}>
                    <View className={'filtertext'}>{filterText}</View>
                    <Text className={'iconfont icon-shaixuan-01'} ></Text>
                </View>
            </View>
        </View>
    )
}

export default memo(SpNewFilterbar);