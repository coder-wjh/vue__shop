import {request} from '../request'

export function getOrderList(queryInfo) {
  return request({
    url:'/orders',
        method:'GET',
        params:{
          ...queryInfo
        }
  })
}