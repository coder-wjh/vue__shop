import {request} from '../request'

export function deleteCateInfo(id) {
  return request({
    url:'/categories/'+id,
    method: 'delete',
    
  })
}