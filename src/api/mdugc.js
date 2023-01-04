import req from './req'

// 首页列表

export function yuyueActivityList(data) {
    return req.get("/article/usermanagement", data);
}
// 笔记
// 笔记列表
export function postlist(data) {
    return req.get("/ugc/post/list", data);
}
// 发布笔记
export function create( params ) {
    return req.post("/ugc/post/create",params)
}
// 笔记详情
export function postdetail(params) {
    return req.get("/ugc/post/detail", params);
}
// 笔记点赞
export function postlike( params ) {
    return req.post("/ugc/post/like",params)
}
// 收藏|取消收藏
export function postfavorite( params ) {
    return req.post("/ugc/post/favorite",params)
}
// 删除笔记
export function postdelete( params ) {
    return req.post("/ugc/post/delete",params)
}
// 分享笔记
export function postshare( params ) {
    return req.post("/ugc/post/share",params)
}
// 笔记设置
export function postsetting(params) {
    return req.get("/ugc/post/setting", params);
}

// tag
// 添加tag
export function tagcreate( params ) {
    return req.post("/ugc/tag/create",params)
}
// tag列表
export function taglist( params ) {
    return req.get("/ugc/tag/list",params)
}
// 话题
// 创建话题
export function topiccreate( params ) {
    return req.post("/ugc/topic/create",params)
}
// 话题列表
export function topiclist( params ) {
    return req.get("/ugc/topic/list",params)
}

// 评论
// 发表评论
export function commentcreate( params ) {
    return req.post("/ugc/comment/create",params)
}
// 评论列表
export function commentlist( params ) {
    return req.get("/ugc/comment/list",params)
}
// 点赞评论
export function commentlike( params ) {
    return req.post("/ugc/comment/like",params)
}
// 删除评论
export function commentdelete( params ) {
    return req.post("/ugc/comment/delete",params)
}

// 粉丝
// 获取粉丝列表
export function followerlist( params ) {
    return req.get("/ugc/follower/list",params)
}
// 关注|取消关注
export function followercreate( params ) {
    return req.post("/ugc/follower/create",params)
}
// 获取统计数量
export function followerstat( params ) {
    return req.get("/ugc/follower/stat",params)
}

// 消息
// 设置为已读(按类型，从哪个类型点进去就发起请求
export function messagesetTohasRead( params ) {
    return req.post("/ugc/message/setTohasRead",params)
}
// 获取消息列表
export function messagelist( params ) {
    return req.get("/ugc/message/list",params)
}
// 获取消息详情
export function messagedetail( params ) {
    return req.get("/ugc/message/detail",params)
}
// 消息桌面
export function messagedashboard( params ) {
    return req.get("/ugc/message/dashboard",params)
}
