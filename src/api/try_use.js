import axios from '@/libs/api.request'
// 查询试用列表
export const tryUseList = (params) => {
  return axios.request({
    url: 'try_use',
    params,
    method: 'get'
  })
}

// 添加试用
export const addTryUse = (data) => {
  return axios.request({
    url: 'try_use',
    data,
    method: 'post'
  })
}

// 删除试用
export const removeTryUse = (data) => {
  return axios.request({
    url: 'try_use',
    data,
    method: 'delete'
  })
}

// 编辑试用
export const editTryUse = (data, id) => {
  return axios.request({
    url: 'try_use/' + id,
    data,
    method: 'put'
  })
}

// 编辑-查询渲染试用详情
export const tryUseListDetail = (id) => {
  return axios.request({
    url: 'try_use/' + id,
    method: 'get'
  })
}

// 试用排序
export const sortTryUseListItem = (data) => {
  return axios.request({
    url: 'try_use/sort',
    data,
    method: 'patch'
  })
}

// 申请列表
export const signList = (id, params) => {
  return axios.request({
    url: 'try_use/' + id + '/sign',
    params,
    method: 'get'
  })
}

// 删除申请
export const removeSignList = (data) => {
  return axios.request({
    url: 'try_use/sign',
    data,
    method: 'delete'
  })
}

// 报告列表
export const reportList = (id, params) => {
  return axios.request({
    url: 'try_use/' + id + '/report',
    params,
    method: 'get'
  })
}

// 删除报告
export const removeReportList = (data) => {
  return axios.request({
    url: 'try_use/report',
    data,
    method: 'delete'
  })
}
