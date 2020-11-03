import {request} from '../request'

export function deleteUserInfo(id) {
  return request({
    url:'/roles/'+id,
    method: 'delete',
    
  })
}