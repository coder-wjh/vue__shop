import {request} from '../../request'

export function addGoods(form) {
  return request({
    url:'/goods',
    method:'post',
    data:{
      ...form
    }
  })
}