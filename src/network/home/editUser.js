import {request} from '../request'

export function editUserInfo(id,editForm) {
  return request({
    url:'/users/'+id,
    method: 'put',
    data: {
      ...editForm
    }
  })
}