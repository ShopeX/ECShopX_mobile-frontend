import { getCurrentPages } from "@tarojs/taro";

/**
 *
 * @export
 * @param {*} params
 * @returns
 */
export const getBoundingClientRect = function (element) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery();
    query.selectAll(element).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) =>
      resolve({ boundingClientRect: res[0], scrollOffset: res[1] })
    );
  });
};

/**
 * 判断点击是否落在目标元素
 * @param {Object} clickInfo 用户点击坐标
 * @param {Object} boundingClientRect 目标元素信息
 * @param {Object} scrollOffset 页面位置信息
 * @returns {Boolean}
 */
export const isClickTrackArea = function (
  clickInfo,
  boundingClientRect,
  scrollOffset
) {
  if (!boundingClientRect) return false;
  const { x, y } = clickInfo.detail;
  const { left, right, top, height } = boundingClientRect;
  const { scrollTop } = scrollOffset;
  if (
    left < x &&
    x < right &&
    scrollTop + top < y &&
    y < scrollTop + top + height
  ) {
    return true;
  }
  return false;
};

/**
 * 获取当前页面
 */
export const getActivePage = function () {
  const curPages = getCurrentPages();
  if (curPages.length) {
    return curPages[curPages.length - 1];
  }
  return {};
};

/**
 * 获取第一个页面
 */
export const getPrevPage = function () {
  const curPages = getCurrentPages();
  if (curPages.length > 1) {
    return curPages[curPages.length - 2];
  }
  return {};
};

// export const isClickTrackArea = function ( clickInfo, boundingClientRect, scrollOffset ) {
//   if(!boundingClientRect) return false
// }
