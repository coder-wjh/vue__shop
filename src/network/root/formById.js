import {request} from '../request'

export function getFormById(id) {
  return request({
    url:'/roles/'+id,
    method: 'get',
    
  })
}