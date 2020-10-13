import {request} from '../request'

export function getFormById(id) {
  return request({
    url:'/users/'+id,
    method: 'get',
    
  })
}