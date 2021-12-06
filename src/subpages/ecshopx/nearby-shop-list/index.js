import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { SpNavBar, SpNewInput, SpNewFilterbar, SpNewShopItem, SpNewFilterDrawer, SpLoadMore } from '@/components'
import { classNames, isNavbar } from '@/utils';
import { FILTER_DATA, FILTER_DRAWER_DATA, DEFAULT_SORT_VALUE,fillFilterTag } from '../consts/index';
import api from '@/api'
import { usePage, useFirstMount } from '@/hooks';
import './index.scss';

const NavbarTitle = '附近商家';

// const { navbarHeight }=getNavbarHeight();

//微信小程序顶部距离=导航栏距离+输入框距离+筛选tab距离
// const top=`${pxTransform(navbarHeight)+ 92 + 92}rpx`;

const NearbyShopList = (props) => {

    const [filterValue, setFilterValue] = useState(DEFAULT_SORT_VALUE);

    const [filterVisible, setFilterVisible] = useState(false);

    const [dataList, setDataList] = useState([]); 

    //物流
    const [logistics,setLogistics]=useState({
        //自提
        is_ziti:undefined,
        //快递
        is_delivery:undefined,
        //达达
        is_dada:undefined
    }); 

    //标签id
    const [tag,setTag]=useState('');

    const handleClickFilterLabel = useCallback(
        (item) => {
            setFilterValue(item);
        },
        [],
    );

    const handleClickInput = useCallback(
        () => {
            Taro.navigateTo({
                url: '/subpages/ecshopx/nearby-shop-search/index'
            })
        },
        []
    );

    const handleDrawer=useCallback(
        (flag) => (selectedValue) => {
            setFilterVisible(flag); 
            if(!selectedValue.tag && !Array.isArray(selectedValue.tag)) return ;   
            setTag(selectedValue.tag.length?selectedValue.tag.join(','):''); 
            const is_ziti=selectedValue.logistics.includes('ziti')?1:undefined;
            const is_delivery=selectedValue.logistics.includes('delivery')?1:undefined;
            const is_dada=selectedValue.logistics.includes('dada')?1:undefined;
            setLogistics({
                is_ziti,
                is_delivery,
                is_dada
            });
        },
        [],
    ); 

    const mounted = useFirstMount();

    const fetch = async ({ pageIndex, pageSize }) => {
        const params = {
            page: pageIndex,
            pageSize,
            // province:'上海市',
            // city:'上海市', 
            // area:'徐汇区',
            type: 0,
            // name:'',
            // card_id:'',
            // isToken:false,
            show_discount: 1,
            show_marketing_activity: 1,
            is_ziti:logistics.is_ziti,
            is_delivery:logistics.is_delivery,
            is_dada:logistics.is_dada,
            distributor_tag_id:tag
            // lng:121.4177321,
            // lat:31.175441,
            // sort_type:filterValue
        }
        const {
            list,
            total_count,
            tagList
        } = await api.shop.list(params);

        setDataList([
            ...dataList,
            ...list
        ]);
        setTotal(total_count);
        fillFilterTag(tagList);
    };

    const { loading, hasNext, total, setTotal, nextPage, resetPage } = usePage({
        fetch
    });

    useEffect(() => {
        if (mounted) {
            resetPage();
            setDataList([]);
        }
    }, [filterValue]);

    useEffect(() => {
        if (mounted) {
            resetPage();
            setDataList([]);
        }
    }, [tag,logistics]);  

    return (
        <View className={classNames(
            'sp-page-nearbyshoplist',
            {
                'has-navbar': isNavbar()
            }
        )}>

            <SpNavBar
                title={NavbarTitle}
                leftIconType='chevron-left'
                fixed='true'
            />

            <View className={'sp-page-nearbyshoplist-input'}>
                <SpNewInput
                    isStatic
                    onClick={handleClickInput}
                />
            </View>

            <SpNewFilterbar
                filterData={FILTER_DATA}
                value={filterValue}
                onClickLabel={handleClickFilterLabel}
                onClickFilter={handleDrawer(true)}
            />

            <ScrollView
                className={classNames('sp-page-nearbyshoplist-scrollview')}
                scrollY
                scrollWithAnimation
                onScrollToLower={nextPage}
            >
                {
                    dataList.map((item, index) => (
                        <SpNewShopItem
                            className={classNames(
                                'in-shoplist',
                                { 'in-shoplist-last': index === 99 }
                            )}
                            info={item}
                        />
                    ))
                }
                {/* 分页loading */}
                <SpLoadMore loading={loading} hasNext={hasNext} total={total} />

            </ScrollView>

            <SpNewFilterDrawer
                visible={filterVisible}
                filterData={FILTER_DRAWER_DATA}
                onCloseDrawer={handleDrawer(false)}
            />

            {/* 分页loading */}
            {/* <SpLoadMore loading={loading} hasNext={hasNext} total={total} /> */}

        </View>
    )
}

export default NearbyShopList;

NearbyShopList.config = {
    // navigationStyle: 'custom'
    navigationBarTitleText: NavbarTitle
}
