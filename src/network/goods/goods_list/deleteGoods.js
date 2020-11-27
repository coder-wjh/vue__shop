import {request} from '../../request'

export function deletedGoods(id) {
  return request({
    url:'/goods/'+id,
    method:'delete',
    params:{
      
    }
  })
}