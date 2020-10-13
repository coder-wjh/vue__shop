import {request} from '../request'

export function getUserForm(queryInfo) {
  return request({
    url:'/users',
    method: 'get',
    params: {
      ...queryInfo
    }
  })
}