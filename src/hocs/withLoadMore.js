import Taro, { Component } from "@tarojs/taro";

export default function withLoadMore(Component) {
    // let loadIndex=0;
    return class WithLoadMoreComponent extends Component {
        constructor(props) {
            super(props);
            
        }

        componentDidMount() {
            this.startWrapperTrack();
        }

        startWrapperTrack() {
            this.endWrapperTrack();
            const observer = Taro.createIntersectionObserver(this.$scope, {
                observeAll: true
            });
            const { type } = this.props;
            let direction=type==='good-scroll'?'right':'bottom';
            observer.relativeToViewport({ [direction]: 0}).observe(".lastItem", res => {
                if (res.intersectionRatio > 0) {
                    const { info: { data }, onLoadMore = () => { },index } = this.props;
                    if (data.length === 50) {  
                        onLoadMore(index,type); 
                    }
                }
            });
            this.wrapperobserver = observer;
        }

        endWrapperTrack() {
            if (this.wrapperobserver) {
                this.wrapperobserver.disconnect();
                this.wrapperobserver = null;
            }
        }

    }
}
