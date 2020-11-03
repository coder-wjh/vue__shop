import {request} from '../request'

export function getRightList(type) {

  return request({
    url:'/rights/'+type,
    method: 'get',
    
  })
}