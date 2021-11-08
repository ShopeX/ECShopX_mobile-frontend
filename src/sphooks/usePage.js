import { useState, useEffect } from "@tarojs/taro";

export default ( props ) => {
  const { fetch } = props;
  const [page, setPage] = useState({
    pageIndex: 1,
    pageSize: 5
  });
  
  useEffect( () => {
    fetch(page);
  }, [page]);

  const nextPage = () => {
    setPage({
      ...page,
      pageIndex: page.pageIndex + 1
    });
  };

  return {
    pageIndex: page.pageIndex,
    pageSize: page.pageSize,
    nextPage
  };
};
