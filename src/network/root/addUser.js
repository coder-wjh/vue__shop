import {request} from '../request'

export function addUsers(roleName,roleDesc) {
  return request({
    url:'/roles',
    method: 'post',
    data: {
      roleName,
      roleDesc
    }
  })
}