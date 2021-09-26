export function setPageTitle(title) {
  document.title = title;
  var mobile = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(mobile)) {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    // 替换成站标favicon路径或者任意存在的较小的图片即可
    // iframe.setAttribute('src', '/favicon.ico')
    // iframe.setAttribute('src','/wt_logo.png')
    var iframeCallback = function() {
      setTimeout(function() {
        iframe.removeEventListener("load", iframeCallback);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener("load", iframeCallback);
    document.body.appendChild(iframe);
  }
}

export const platformTemplateName = "yykweishop";

export const transformPlatformUrl = url => {
  return url;
};

