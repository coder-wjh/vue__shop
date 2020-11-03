import {request} from '../request'

export function deleteRightInfo(roleId,rightId) {
  return request({
    url:'/roles/'+roleId+'/rights/'+rightId,
    method: 'delete',
    
  })
}