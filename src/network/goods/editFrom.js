import {request} from '../request'

export function editFrom(id,cat_name) {
  return request({
    url:'/categories/'+id,
    method:'put',
    data:{
      cat_name 
    }
  })
}