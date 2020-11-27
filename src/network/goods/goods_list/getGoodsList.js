import {request} from '../../request'

export function GoodsList(queryInfo) {
  return request({
    url:'/goods',
        method:'GET',
        params:{
          ...queryInfo
        }
  })
}