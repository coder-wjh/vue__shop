import {request} from '../request'

export function getRootList(type) {

  return request({
    url:'/rights/'+type,
    method: 'get',
    
  })
}