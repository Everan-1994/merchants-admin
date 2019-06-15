import axios from '@/libs/api.request'

export const login = ({email, password}) => {
  const data = {
    email,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'delete'
  })
}

// 获取成员详情
export const getUserDetail = () => {
  return axios.request({
    url: 'info',
    method: 'get'
  })
}

export const updateUser = (data) => {
  return axios.request({
    url: 'update',
    data,
    method: 'put'
  })
}
