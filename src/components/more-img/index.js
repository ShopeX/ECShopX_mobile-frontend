import Taro, { Component } from '@tarojs/taro'
import { SpImg } from "@/components";
import { classNames } from '@/utils'
import { linkPage } from "@/utils/helper";
import './index.scss'

export default class MoreImg extends Component {

    constructor(props) {
        super(props);
    }

    handleClickMore = () => {
        const { config } = this.props;
        const { moreLink } = config;
        if (moreLink) {
            linkPage(moreLink.linkPage, moreLink);
        } else {
            this.navigateToList(config.type, config.seckillId);
        }
    };

    navigateTo(url) {
        Taro.navigateTo({ url });
    }

    navigateToList = (type, seckillId) => {
        const { dis_id = "" } = this.props;
        if (type === "goods") {
            this.navigateTo(`/pages/item/list?dis_id=${this.props.dis_id || ""}`);
        } else if (type === "limitTimeSale") {
            Taro.navigateTo({
                url: `/marketing/pages/item/seckill-goods-list?seckill_type=limited_time_sale&seckill_id=${seckillId}&dis_id=${this
                    .props.dis_id || ""}`
            });
        } else {
            Taro.navigateTo({
                url: `/marketing/pages/item/seckill-goods-list?seckill_type=normal&seckill_id=${seckillId}&dis_id=${this
                    .props.dis_id || ""}`
            });
        }
    };


    render() {

        const { dataLength = 0, config:{moreLink = {}}={}, base = {},more } = this.props;  

        return (dataLength < 50 || (dataLength===50 && more===false) || dataLength>51) && moreLink.id && (<View className={classNames('more_img')} onClick={this.handleClickMore}>
            <View className='img'>
                <SpImg
                    img-class="goods-img"
                    src={base.backgroundImg}
                    mode="aspectFill"
                    width="240"
                    lazyLoad
                />
            </View>
            <View className='text'>查看更多</View>
        </View>)
    }
}
