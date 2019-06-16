import axios from '@/libs/api.request'
// 查询话题列表
export const topickList = (params) => {
    return axios.request({
        url: 'topic',
        params,
        method: 'get'
    })
}
// 添加话题
export const addTopic = (data) => {
    return axios.request({
        url: 'topic',
        data,
        method: 'post'
    })
}

// 删除话题
export const removeTopic = (data) => {
    return axios.request({
        url: 'topic',
        data,
        method: 'delete'
    })
}

// 编辑话题
export const editTopic = (data, id) => {
    return axios.request({
        url: 'topic/' + id,
        data,
        method: 'put'
    })
}

// 编辑-查询渲染话题详情
export const topicListDetail = (id) => {
    return axios.request({
        url: 'topic/' + id,
        method: 'get'
    })
}

// 话题排序
export const sortTopicListItem = (data) => {
    return axios.request({
        url: 'topic/sort',
        data,
        method: 'patch'
    })
}

// 查询评论列表
export const commentList = (id, params) => {
    return axios.request({
        url: 'topic/' + id + '/item',
        params,
        method: 'get'
    })
}

// 删除评论
export const removeCommentList = (data) => {
    return axios.request({
        url: 'topic/item',
        data,
        method: 'delete'
    })
}
