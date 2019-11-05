import axios from '@/libs/api.request'
// 查询奖品列表
export const prizeList = () => {
  return axios.request({
    url: 'prizes',
    method: 'get'
  })
}

// 添加奖品
export const addPrize = (data) => {
  return axios.request({
    url: 'prizes',
    data,
    method: 'post'
  })
}

// 删除奖品
export const removePrize = (data) => {
  return axios.request({
    url: 'prizes',
    data,
    method: 'delete'
  })
}

// 编辑奖品
export const editPrize = (data, id) => {
  return axios.request({
    url: 'prizes/' + id,
    data,
    method: 'put'
  })
}

// 编辑-查询渲染奖品详情
export const prizeDetail = (id) => {
  return axios.request({
    url: 'prizes/' + id,
    method: 'get'
  })
}

