import axios from '@/libs/api.request'
// 查询活动列表
export const activityList = (params) => {
  return axios.request({
    url: 'activity',
    params,
    method: 'get'
  })
}

// 添加活动
export const addActivity = (data) => {
  return axios.request({
    url: 'activity',
    data,
    method: 'post'
  })
}

// 删除活动
export const removeActivity = (data) => {
  return axios.request({
    url: 'activity',
    data,
    method: 'delete'
  })
}

// 编辑活动
export const editActivity = (data, id) => {
  return axios.request({
    url: 'activity/' + id,
    data,
    method: 'put'
  })
}

// 编辑-查询渲染活动详情
export const activityListDetail = (id) => {
  return axios.request({
    url: 'activity/' + id,
    method: 'get'
  })
}

// 活动排序
export const sortActivityListItem = (data) => {
  return axios.request({
    url: 'activity/sort',
    data,
    method: 'patch'
  })
}

// 申请列表
export const signList = (id, params) => {
  return axios.request({
    url: 'activity/' + id + '/sign',
    params,
    method: 'get'
  })
}

// 删除申请
export const removeSignList = (data) => {
  return axios.request({
    url: 'activity/sign',
    data,
    method: 'delete'
  })
}

// 报告列表
export const reportList = (id, params) => {
    return axios.request({
        url: 'activity/' + id + '/report',
        params,
        method: 'get'
    })
}

// 删除报告
export const removeReportList = (data) => {
    return axios.request({
        url: 'activity/report',
        data,
        method: 'delete'
    })
}
