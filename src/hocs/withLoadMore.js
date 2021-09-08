import Taro, { Component } from "@tarojs/taro";

export default function withLoadMore(Component) {
 
    return class WithLoadMoreComponent extends Component {
        constructor(props) {
            super(props);  
        }

        componentDidMount() { 
            this.startWrapperTrack();
            this.setTimer && this.setTimer();
        }

        componentDidUpdate(){ 
            this.startWrapperTrack();
           
        }

        startWrapperTrack() {
            this.endWrapperTrack();
            const observer = Taro.createIntersectionObserver({
                selectAll: true
            });
            console.log("observer",observer)
            const { type } = this.props;
            let direction=type==='good-scroll'?'right':'bottom'; 
            observer.relativeToViewport({ [direction]: 0}).observe(".lastItem", res => { 
                if (res.intersectionRatio > 0) { 
                    const { info: { data,more }, onLoadMore = () => { },index } = this.props;
                    if (more) {   
                        onLoadMore(index,type,'_',data.length); 
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
