import {request} from '../request'

export function editUserInfo(id,editForm) {
  return request({
    url:'/roles/'+id,
    method: 'put',
    data: {
      ...editForm
    }
  })
}