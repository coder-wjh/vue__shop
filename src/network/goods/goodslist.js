import {request} from '../request'

export function getGoodsList(type,pagenum,pagesize) {
  return request({
    url:'/categories',
        method:'GET',
        params:{
            pagenum,
            pagesize,
            type,
        }
  })
}