import {request} from '../request'

export function getMenuForm() {
  return request({
    url:'/menus',
    method: 'get',
    
  })
}