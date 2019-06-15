/**
 * Created by mll on 2018/10/29.
 */
import axios from '@/libs/api.request'

export const access = () => {
  return axios.request({
    url: '/accessList',
    method: 'get'
  })
}
