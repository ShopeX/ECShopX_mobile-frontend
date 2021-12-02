import Taro, { useState, memo } from '@tarojs/taro';
import { View, Image,Text } from '@tarojs/components';
import { classNames } from '@/utils';
import { DistributionLabel } from './comps';
import { SpNewCoupon } from '@/components';
import './index.scss';
const ImageSRC = 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'

const SpNewShopItem = (props) => {

    const {
        title = 'ShopX徐汇区田尚坊钦州北路店ShopX徐汇区田尚坊钦州北路店',
        distance = '660m',
        rate = '4.9',
        sale = 8888,
        className = '',
        couponsData = [
            { value: '10', label: '10元' },
            { value: '30', label: '30元' },
            { value: '60', label: '60元', isReceive: true },
        ],
        discountName='满减',
        discountMsg='好物狂欢节享满199减30，领10元叠好物狂欢节享满199减30，领10元叠…',
        inSearch=false
    } = props;

    return inSearch ? (
        <View
            className={classNames('sp-component-newshopitem', className)}
        >
            <View className={'sp-component-newshopitem-header'}>
                <View className={'left'}>
                    <Image src={ImageSRC} className={'img'} ></Image>
                </View>
                <View className={'center'}>
                    <View className={'name'}>{title}</View>
                    <View className={'rate'}>
                        <Text>评分：{rate}</Text>    
                        <Text className={'sale'}>月销：{sale}</Text>    
                    </View>
                </View>
                <View className={'right'}>1000m</View>
            </View>
            <View className={'sp-component-newshopitem-logo'}>
                <Image src={ImageSRC} className={'img'} />
            </View>
            <View className={'sp-component-newshopitem-good-list'}></View>
        </View>
    ) : (
        <View
            className={classNames('sp-component-newshopitem', className)}
        >
            <View className={'sp-component-newshopitem-left'}>
                <Image src={ImageSRC} className={'img'} />
            </View>
            <View className={'sp-component-newshopitem-right'}>
                <View className={'sp-component-newshopitem-right-top'}>
                    <View className={'lineone'}>
                        <View className={'title'}>{title}</View>
                        <View className={'distance'}>{distance}</View>
                    </View>
                    <View className={'linetwo'}>
                        <View className={'info'}>
                            <Text>评分：{rate}</Text>
                            <Text class='sale'>月销：{sale}</Text>
                        </View>
                        <View className={'distribute'}>
                            <DistributionLabel>达达配送</DistributionLabel>
                        </View>
                    </View>
                </View>
                <View className={'sp-component-newshopitem-right-bottom'}>
                    <View className={'activity-line-one'}>
                        <View className={'left'}>
                            {
                                couponsData.map((item) => {
                                    return (
                                        <SpNewCoupon
                                            text={item.label}
                                            className={'in-new-shop-item'}
                                            isReceive={item.isReceive}
                                        />
                                    )
                                })
                            }
                        </View>
                        <View className={'right'}>
                            <View className={'right-arrow'}>
                                <Text className={'iconfont icon-arrowDown'}></Text>
                            </View>
                        </View>
                    </View>
                    <View className={'activity-line-two discount'}>
                        <View className={'left'}>
                            <View className={'label'}>
                                <Text className={'name'}>{discountName}</Text>
                                <Text className={'msg'}>{discountMsg}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default memo(SpNewShopItem);