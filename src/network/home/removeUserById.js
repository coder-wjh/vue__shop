import {request} from '../request'

export function deleteUserInfo(id) {
  return request({
    url:'/users/'+id,
    method: 'delete',
    
  })
}