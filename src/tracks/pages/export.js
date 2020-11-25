import home from "./pages/home";
import item from "./pages/item";
import itemDetail from "./pages/item_detail";

const trackConfig = [home, item, itemDetail];

require.context( './', false,  /\.js$/ ).keys().forEach( key => {
    console.log(key)
})


export default trackConfig;
