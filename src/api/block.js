import axios from '@/libs/api.request'
// 查询区块列表
export const blockList = () => {
    return axios.request({
        url: 'block',
        method: 'get'
    })
}
// 添加区块
export const addBlock = (data) => {
    return axios.request({
        url: 'block',
        data,
        method: 'post'
    })
}

// 删除区块
export const removeBlock = (data) => {
    return axios.request({
        url: 'block',
        data,
        method: 'delete'
    })
}

// 编辑区块
export const editBlock = (data, id) => {
    return axios.request({
        url: 'block/' + id,
        data,
        method: 'put'
    })
}

// 编辑-查询渲染区块详情
export const blockListDetail = (id) => {
    return axios.request({
        url: 'block/' + id,
        method: 'get'
    })
}

// 查询区块内容列表
export const blockListItem = (id, params) => {
    return axios.request({
        url: 'block/' + id + '/item',
        params,
        method: 'get'
    })
}

// 查询区块内容详情
export const blockListItemDetail = (id) => {
    return axios.request({
        url: 'block/item/' + id,
        method: 'get'
    })
}

// 添加区块内容
export const addBlockListItem = (data) => {
    return axios.request({
        url: 'block/item',
        data,
        method: 'post'
    })
}

// 编辑区块内容
export const editBlockListItem = (data, id) => {
    return axios.request({
        url: 'block/item/' + id,
        data,
        method: 'put'
    })
}

// 删除区块内容
export const removeBlockListItem = (data) => {
    return axios.request({
        url: 'block/item',
        data,
        method: 'delete'
    })
}

// 排序区块内容
export const sortBlockListItem = (data) => {
    return axios.request({
        url: 'block/item/sort',
        data,
        method: 'patch'
    })
}
