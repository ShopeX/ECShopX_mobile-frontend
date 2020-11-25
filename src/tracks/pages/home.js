import sr from "sr-sdk-wxapp";

const tracks = {
  path: "pages/index",
  elementTracks: [
    {
      element: ".playing-item",
      dataKeys: ["isPlayed"]
    }
  ],
  methodTracks: [
    {
      method: "testFn",
      dataKeys: (page, arg) => {
        console.log(page.state, arg);
        return page.state;
      }
    },
    {
      method: "componentDidMount",
      dataKeys: ( page, arg ) => {
        // debugger
        // sr.track("browse_wxapp_page", {
        //   refer_page: "pages/product?sku_id=AOdjf7u",
        //   is_newly_open: true
        // });
      }
    },
    {
      method: "componentDidShow",
      dataKeys: (page, arg) => {
        return "did show";
      }
    },
    // {
    //   method: "componentDidHide",
    //   dataKeys: ( page, arg ) => {
    //     return 'did hide'
    //   }
    // }
  ]
};

export default tracks;
