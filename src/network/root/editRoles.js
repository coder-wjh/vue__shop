import {request} from '../request'

export function editRoles(roleId,rids) {
  return request({
    url:'/roles/'+roleId+'/rights',
    method: 'post',
    data: {
      rids
    }
  })
}