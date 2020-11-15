import {request} from '../request'

export function getParentGoodsList(type,pagenum,pagesize) {
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