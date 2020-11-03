import {request} from '../request'

export function saveUsersInfo(id,rid) {
  return request({
    url:'/users/'+id+'/role',
    method: 'put',
    data: {
      rid
    }
  })
}