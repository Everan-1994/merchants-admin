/**
 * Created by mll on 2018/10/29.
 */
import axios from '@/libs/api.request'

export const getBoardData = () => {
  return axios.request({
    url: '/board',
    method: 'get'
  })
}
